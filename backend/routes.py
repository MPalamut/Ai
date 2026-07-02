import sqlite3
from fastapi import APIRouter, Request
from backend.database import DB_PATH 

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
def login(data: dict):
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    
    conn.close()
    
    if user:
        return {"status": "success", "message": f"Willkommen zurück, {username}!"}
    else:
        return {"status": "error", "message": "Falscher Benutzername oder Passwort!"}