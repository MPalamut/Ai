from fastapi import APIRouter, Request
import sqlite3
from backend.database import DB_PATH
import hashlib
from datetime import datetime

router = APIRouter()

@router.get("/")
async def read_root(request: Request):
    ip = request.client.host
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO visits (ip, dateTime) VALUES (?,?)", (ip, timestamp))
        conn.commit() 
        status = "success"
        message = "Visit saved"

    except sqlite3.Error as e:
        status = "error"
        message = e
    finally:
        conn.close()
    
    return {"status": status, "message": message}

@router.post("/register")
def register(data: dict):
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try: 
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            status = "error"
            message = "Benutzername existiert bereits"
        
        else:
            password_bytes = password.encode('utf-8')
            hashed_password = hashlib.sha256(password_bytes).hexdigest()

            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
            conn.commit()
            status = "success"
            message = f"Registrierung erfolgreich! Willkommen, {username}."
    except sqlite3.Error as e:
        status = "error"
        message = f"Datenbankfehler: {str(e)}"
    finally:
        conn.close()
        
    return {"status": status, "message": message}

@router.post("/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")
    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, hashed_password))
        user = cursor.fetchone()
        if user:
            status = "success"
            message = f"Willkommen zurück, {username}!"
        else:  
            status = "error"
            message = "Falscher Benutzername oder Passwort!"
    except sqlite3.Error as e:
        status = "error"
        message = f"Datenbankfehler: {str(e)}"
    finally:
        conn.close
    
    return {"status": status, "message": message}
   
@router.post("/report")
async def report(payload: dict):
    username = payload.get("username")
    report_text = payload.get("reportText")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO reports (username, reportText, createdAt) VALUES (?,?,?)", (username, report_text, timestamp))
        conn.commit() 
        status = "success"
        message = "Bericht eingetragen"

    except sqlite3.Error as e:
        status = "error"
        message = e
    finally:
        conn.close()
    
    return {"status": status, "message": message}
