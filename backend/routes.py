import sqlite3
from fastapi import APIRouter, HTTPException, Cookie, Response
from backend.database import DB_PATH 
import uuid
import os
import json
from datetime import datetime
router = APIRouter()

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
    
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
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
async def report(payload: dict, session_id: str = Cookie(None)):

    if not session_id:
        raise HTTPException(status_code=401, detail="Nicht eingeloggt (Kein Cookie)")


    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM sessions WHERE created_at <= datetime('now', '-24 hours')")

    cursor.execute("""
        SELECT users.id, users.username 
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        WHERE sessions.session_id = ?
    """, (session_id,))
    
    user = cursor.fetchone()
    

    if not user:
        conn.close()
        raise HTTPException(status_code=401, detail="Ungültige oder abgelaufene Session")


    user_id = user[0]
    username = user[1]
    conn.close() 


    report_text = payload.get("reportText")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file = os.path.join(current_dir, "..", "reports.json")
    
    report_entry = {
        "timestamp": timestamp,
        "user_id": user_id,
        "username": username,
        "report": report_text
    }

    if os.path.exists(file):
        with open(file, "r") as f:
            reports_data = json.load(f)
    else:
        reports_data = []

    reports_data.append(report_entry)

    with open(file, "w") as f:
        json.dump(reports_data, f, indent=4)

    return {"message": "Report received", "report": report_entry}