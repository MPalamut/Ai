import sqlite3
from fastapi import APIRouter, HTTPException, Cookie, Response, Request
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

@router.get("/users")
def get_items():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    
    conn.close()
    return {"data": rows}

@router.post("/users")
async def add_item(name : str):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO users (name) VALUES (?)", (name,))

    conn.commit()
    conn.close()
    return {"status": "Eintrag erfolgreich!"}

@router.post("/register")
def register(data: dict):
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        conn.close()
        return {"status": "error", "message": "Benutzername existiert bereits!"}
    
    password_bytes = password.encode('utf-8')
    hashed_password = hashlib.sha256(password_bytes).hexdigest()

    try:
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
def login(data: dict, response: Response):
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()

    if user:
        conn.commit()
        conn.close()
        return {"status": "success", "message": f"Willkommen zurück, {username}!"}    
    else:
        conn.close()
        return {"status": "error", "message": "Falscher Benutzername oder Passwort!"}
    
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
