import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Register.module.css"
import { getStore } from "./Store";

export default function Register({ onClose }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [authMode, setAuthMode] = useState("register");
    const store = getStore();

   const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!name || !password) {
            alert("Bitte füllen Sie alle Felder aus.");
            return;
        }

        if (password.length < 8) {
            alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
            return;
        }

        const endpoint = authMode === "register" ? "/register" : "/login";

        const payload = {
            username: name,
            password: password
        };

        try {
            const response = await fetch(`http://172.16.16.106:8000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.status === "success") {
                alert(result.message);
                onClose();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Fehler:", error);
            alert("Verbindungsfehler zum Server.");
        }
    };


    const handleClickOutside = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.bg} onClick={handleClickOutside}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <button className={styles.close} onClick={onClose}>X</button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.auth}>
                        <div>
                             <input type="radio" id="register" name="auth" value="register" checked={authMode === "register"} onChange={() => setAuthMode("register")} />
                        <label for="register">Registrieren</label>  
                        </div>

                        <div>
                            <input type="radio" id="login" name="auth" value="login" checked={authMode === "login"} onChange={() => setAuthMode("login")} />
                            <label for="login">Einloggen</label>
                        </div>

                    </div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Passwort"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={styles.send} type="submit">{authMode === "register" ? "Registrieren" : "Einloggen"}</button>
                </form>
            </div>
        </div>

    );
}