from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from pypdf import PdfReader
import base64
import io
from docx import Document
from backend.database import init_db
import sqlite3
from backend.database import DB_PATH
import hashlib
from datetime import datetime

app = FastAPI()
init_db()

def init():
   url = "http://10.10.70.105:1234/api/v1/models/load"
   payload = {"model": "google/gemma-4-e4b"}
   try:
         response = requests.post(url, json=payload)
         response.raise_for_status()
         print("Model loaded")
   except Exception as e:
         print(f"Error loading model: {e}")
init()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://10.10.70.105:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root(request: Request):
    ip = request.client.host
    timestamp = datetime.now().strftime("%Y-%m-%d")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO visits (ip, dateTime) VALUES (?,?)", (ip, timestamp))
        conn.commit() 
        status = "success"
        message = "Welcome"

    except sqlite3.Error as e:
        status = "error"
        message = e
    finally:
        conn.close()
    
    return {"status": status, "message": message}

@app.get("/models")
def models():
    url = "http://10.10.70.105:1234/v1/models"
    response = requests.get(url)
    return response.json()

@app.post("/responses")
async def responses(request: Request, data: dict):
    ip = request.client.host
    url = "http://10.10.70.105:1234/v1/responses"
    headers = {"Content-Type": "application/json"}
    selected_model = data.get("selectedModel")
    input_text = data.get("input")
    temperature = data.get("temperature")
    searchdocs = data.get("searchdocs")
    previous_response = data.get("previousResponse")
    file = data.get("file")
    image = data.get("image")
    timestamp = datetime.now().strftime("%Y-%m-%d")

    if file:
        extracted_text = ""
        docx = file.startswith("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document")

        if "," in file:
            file = file.split(",")[1]
            
        file_bytes = base64.b64decode(file)
        file_stream = io.BytesIO(file_bytes)
        
        if docx:
            doc = Document(file_stream)
            for para in doc.paragraphs:
                if para.text:
                    extracted_text += para.text + "\n"
                
            for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        extracted_text += "\n" + "\t".join(row_text) + "\n"

            max_chars = 11000
            if len(extracted_text) > max_chars:
                extracted_text = extracted_text[:max_chars]
                
        else:
            reader = PdfReader(file_stream)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

        max_chars = 12000
        if len(extracted_text) > max_chars:
            extracted_text = extracted_text[:max_chars]
        
        data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        },
                        { 
                            "type": "input_text",
                            "text": extracted_text
                        }
                    ]
                }
            ]
        }

    elif image:
        data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        },
                        { 
                            "type": "input_image",
                            "image_url": image
                        }
                    ]
                }
            ]
        }

    elif searchdocs:
        alldocsextracted_text = ""
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()

            cursor.execute("SELECT fileName, file FROM documents")
            alldocs = cursor.fetchall()

            for docname, doctext in alldocs:
                alldocsextracted_text += f"\nDokumentname: {docname} -- \n{doctext}"
            
            data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        },
                        { 
                            "type": "input_text",
                            "text": alldocsextracted_text
                        }
                    ]
                }
            ]
        }

        except sqlite3.Error as e:
            print(f"Datenbankfehler: {e}")
        finally:
            conn.close()

    else:
        data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        }
                    ]
                }
            ],
            "temperature": temperature
        }

    if previous_response:
        data["previous_response_id"] = previous_response
        
    response = requests.post(url, headers=headers, json=data)
    responseData = response.json()

    tokens = responseData.get("usage", {}).get("total_tokens", 0)
    
    try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()

            cursor.execute("INSERT INTO tokens (dateTime, amount, ip) VALUES (?, ?, ?)",(timestamp, tokens, ip))
            conn.commit()
    except sqlite3.Error as e:
            print(f"Datenbankfehler {e}")
    finally:
        conn.close()
   
    return response.json()
    
@app.post("/register")
def register(data: dict):
    username = data.get("username")
    password = data.get("password")
    timestamp = datetime.now().strftime("%Y-%m-%d")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try: 
        cursor.execute("SELECT * FROM users WHERE name = ?", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            status = "error"
            message = "Benutzername existiert bereits"
        
        else:
            password_bytes = password.encode('utf-8')
            hashed_password = hashlib.sha256(password_bytes).hexdigest()

            cursor.execute("INSERT INTO users (name, password, registeredAt) VALUES (?, ?, ?)", (username, hashed_password, timestamp))
            conn.commit()
            status = "success"
            message = f"Registrierung erfolgreich! Willkommen, {username}."
    except sqlite3.Error as e:
        status = "error"
        message = f"Datenbankfehler: {str(e)}"
    finally:
        conn.close()
        
    return {"status": status, "message": message}

@app.post("/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")
    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    isAdmin = False
    try:
        cursor.execute("SELECT * FROM users WHERE name = ? AND password = ?", (username, hashed_password))
        user = cursor.fetchone()
        if user:
            status = "success"
            message = f"Willkommen zurück, {username}!"
            if user[3] == "admin":
                isAdmin = True
        else:  
            status = "error"
            message = "Falscher Benutzername oder Passwort!"
    except sqlite3.Error as e:
        status = "error"
        message = f"Datenbankfehler: {str(e)}"
    finally:
        conn.close()
    
    return {"status": status, "message": message, "isAdmin": isAdmin}
   
@app.post("/report")
async def report(data: dict):
    username = data.get("username")
    report_text = data.get("reportText")
    timestamp = datetime.now().strftime("%Y-%m-%d")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("PRAGMA foreign_keys = ON;")

        cursor.execute("SELECT id FROM users WHERE name = ?", (username,))
        row = cursor.fetchone()
        if row:
            userId = row[0]
            cursor.execute("INSERT INTO reports (reportText,  createdAt, userId) VALUES (?,?,?)", (report_text, timestamp, userId))
            conn.commit() 
            status = "success"
            message = "Bericht eingetragen"
        else:
            status = "error"
            message = "Benutzer fehlt"

    except sqlite3.Error as e:
        status = "error"
        message = str(e)
    finally:
        conn.close()
    
    return {"status": status, "message": message}

@app.get("/infos")
async def infos():
    timestamp = datetime.now().strftime("%Y-%m-%d")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM tokens WHERE date(dateTime) = ?", (timestamp,))
        resultPromptsDaily = cursor.fetchone()
        promptsDaily = resultPromptsDaily[0]

        cursor.execute("SELECT SUM(amount) FROM tokens WHERE date(dateTime) = ?", (timestamp,))
        resultDaily = cursor.fetchone()
        tokensDaily = resultDaily[0]

        cursor.execute("SELECT COUNT(DISTINCT ip) FROM visits WHERE date(dateTime) = ?", (timestamp,))
        visits = cursor.fetchall()

        status = "success"
        message = "Get Tokens"

    except sqlite3.Error as e:
        status = "error"
        message = str(e)
    finally:
        conn.close()
    
    return {"status": status, "message": message, "promptsDaily": promptsDaily, "tokensDaily": tokensDaily, "visits": visits}

@app.get("/defaultinfos")
async def defaultinfos(request: Request, username: str):
    ip = request.client.host
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM reports INNER JOIN users ON reports.userId = users.id WHERE users.name = ?", (username,))
        reports = cursor.fetchall()

        cursor.execute("SELECT COUNT(*) FROM reports JOIN users on reports.userId = users.id WHERE users.name = ?", (username,))
        reportCount = cursor.fetchall()

        cursor.execute("SELECT * FROM tokens WHERE ip = ?", (ip,))
        tokens = cursor.fetchall()

        cursor.execute("SELECT Id, dateTime, COUNT(*) FROM tokens WHERE ip = ? GROUP BY dateTime ORDER BY dateTime ", (ip,))
        tokensDaily = cursor.fetchall()

        cursor.execute("SELECT SUM(amount) FROM tokens WHERE ip = ?", (ip,))
        tokenCount = cursor.fetchall()

        cursor.execute("SELECT * FROM documents")
        documents = cursor.fetchall()

    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return {"reports": reports, "reportCount": reportCount, "tokens": tokens, "tokensDaily": tokensDaily, "tokenCount": tokenCount, "documents": documents}
    
@app.get("/admininfos")
async def admininfos():
    timestamp = datetime.now().strftime("%Y-%m-%d")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()

        cursor.execute("SELECT COUNT (*) FROM users")
        usercount = cursor.fetchall()

        cursor.execute("SELECT * FROM reports INNER JOIN users ON reports.userId = users.id")
        reports = cursor.fetchall()

        cursor.execute("SELECT COUNT (*) FROM reports")
        reportcount = cursor.fetchall()

        cursor.execute("SELECT COUNT(*) FROM tokens WHERE date(dateTime) = ?", (timestamp,))
        promptsDaily = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) FROM tokens")
        promptsAll = cursor.fetchone()

        cursor.execute("SELECT Id, dateTime, COUNT(*) FROM tokens GROUP BY dateTime ORDER BY dateTime")
        tokens = cursor.fetchall()

        cursor.execute("SELECT SUM(amount) FROM tokens WHERE date(dateTime) = ?", (timestamp,))
        tokensDaily = cursor.fetchone()
        
        cursor.execute("SELECT SUM(amount) FROM tokens")
        tokensAll = cursor.fetchone()

        cursor.execute("SELECT * FROM visits")
        visits = cursor.fetchall()

        cursor.execute("SELECT COUNT(DISTINCT ip) FROM visits")
        visitCount = cursor.fetchall()

        cursor.execute("SELECT * FROM documents")
        documents = cursor.fetchall()

        cursor.execute("SELECT Count(*) FROM documents")
        documentsAll = cursor.fetchone()

        status = "success"
        message = "Get Admin Infos"

    except sqlite3.Error as e:
        status = "error"
        message = str(e)
    finally:
        conn.close()

    return {"status": status, "message": message, "users": users, "usercount": usercount, "reports": reports, "reportcount": reportcount, "promptsDaily": promptsDaily, "promptsAll": promptsAll, "tokens": tokens, "tokensDaily": tokensDaily, "tokensAll": tokensAll, "visits": visits, "visitCount": visitCount, "documents": documents, "documentsAll": documentsAll}

@app.post("/newuser")
async def newUser(data: dict):
    newusername =  data.get("newusername")
    newuserpassword = data.get("newuserpassword")
    timestamp = datetime.now().strftime("%Y-%m-%d")
    password_bytes = newuserpassword.encode('utf-8')
    hashed_password = hashlib.sha256(password_bytes).hexdigest()

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO users (name, password, registeredAt) VALUES (?, ?, ?)", (newusername, hashed_password, timestamp))
        conn.commit()

        status = "success"

    except sqlite3.Error as e:
        status = "error"
    finally:
        conn.close()
    
    return {"status": status}

@app.post("/removeuser")
async def newUser(data: dict):
    removeuserid =  data.get("removeuserid")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM users WHERE id = ?", (removeuserid))
        conn.commit()

        status = "success"

    except sqlite3.Error as e:
        status = "error"
    finally:
        conn.close()
    
    return {"status": status}

@app.post("/editreport")
async def newUser(data: dict):
    editreportid =  data.get("editreportid")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("UPDATE reports SET status = 'erledigt' WHERE id = ?", (editreportid))
        conn.commit()

        status = "success"

    except sqlite3.Error as e:
        status = "error"
    finally:
        conn.close()
    
    return {"status": status}

@app.post("/newDocument")
async def newDocument(data: dict):
    timestamp = datetime.now().strftime("%Y-%m-%d")
    fileName = data.get("fileName")
    file = data.get("file")
    extracted_text = ""
    docx = file.startswith("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    if "," in file:
            file = file.split(",")[1]
            
    file_bytes = base64.b64decode(file)
    file_stream = io.BytesIO(file_bytes)
        
    if docx:
        doc = Document(file_stream)
        for para in doc.paragraphs:
                if para.text:
                    extracted_text += para.text + "\n"
                
        for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        extracted_text += "\n" + "\t".join(row_text) + "\n"

        max_chars = 11000
        if len(extracted_text) > max_chars:
                extracted_text = extracted_text[:max_chars]
                
    else:
        reader = PdfReader(file_stream)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

        max_chars = 12000
        if len(extracted_text) > max_chars:
            extracted_text = extracted_text[:max_chars]

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO documents (fileName, file, dateTime) VALUES (?, ?, ?)", (fileName, extracted_text, timestamp))
        conn.commit()

        status = "success"

    except sqlite3.Error as e:
        status = "error"
    finally:
        conn.close()
    
    return {"status": status}

@app.post("/changepassword")
async def changepassword(data: dict):
    username = data.get("username")
    oldPassword = data.get("oldPassword")
    newPassword = data.get("newPassword")
    hashedOldPasswordBytes = oldPassword.encode('utf-8')
    hashedOldPassword = hashlib.sha256(hashedOldPasswordBytes).hexdigest()

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE name = ?", (username,))
        user = cursor.fetchone()
        hashedOldpw = user[2]
        if hashedOldPassword == hashedOldpw:
            hashedNewPasswordBytes = newPassword.encode("utf-8")
            hashedNewPassword = hashlib.sha256(hashedNewPasswordBytes).hexdigest()
            cursor.execute("UPDATE users SET password = ? WHERE name = ?", (hashedNewPassword, username))
            conn.commit()
   
        status = "success"
        message = "Get Admin Infos"

    except sqlite3.Error as e:
        status = "error"
        message = str(e)
    finally:
        conn.close()

    return {"status": status, "message": message}
