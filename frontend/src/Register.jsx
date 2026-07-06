import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Register.module.css"
import { getStore } from "./Store";

export default function Register({ onClose }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [authMode, setAuthMode] = useState("register");
    const { setUsername } = getStore()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !password) {
            alert("Bitte fülle alle Felder aus");
            return;
        }

        const payload = {
            username: name,
            password: password
        };

        if (authMode === "register") {
            if (password.length < 8) {
                alert("Das Passwort muss mindestens 8 Zeichen lang sein");
                return;
            }
            try {
                const response = await fetch(`http://172.16.16.106:8000/register`, {
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
                alert("Verbindungsfehler zum Server");
            }
        }

        else {
            try {
                const response = await fetch(`http://172.16.16.106:8000/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (result.status === "success") {
                    setUsername(name);
                    alert(result.message);
                    onClose();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Fehler:", error);
                alert("Verbindungsfehler zum Server");
            }
        }
    }

    return (
        <div className={styles.bg} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button className={styles.close} onClick={onClose}>X</button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.auth}>
                        <div>
                            <input type="radio" id="register" name="auth" value="register" checked={authMode === "register"} onChange={() => setAuthMode("register")} />
                            <label htmlFor="register">Registrieren</label>
                        </div>

                        <div>
                            <input type="radio" id="login" name="auth" value="login" checked={authMode === "login"} onChange={() => setAuthMode("login")} />
                            <label htmlFor="login">Einloggen</label>
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
                    <label htmlFor=""></label>
                </form>
            </div>
        </div>

    );
}