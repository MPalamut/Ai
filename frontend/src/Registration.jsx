import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { getStore } from "./Store";
import styles from "./Registration.module.css"

export default function Registration({ onClose }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [authMode, setAuthMode] = useState("login");
    const navigate = useNavigate();
    const { setUsername, setAdmin} = getStore()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !password) {
            alert("Bitte fülle alle Felder aus")
            return;
        }

        const payload = {
            username: name,
            password: password
        };

        if (authMode === "register") {
            if (password.length < 8) {
                alert("Das Passwort muss mindestens 8 Zeichen beinhalten")
                return;
            }
            try {
                const response = await fetch(`http://10.10.70.105:8000/register`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (result.status === "success") {
                    alert(result.message)
                } else {
                  alert(result.message)
                }
            } catch (error) {
                console.error("Fehler:", error);
               alert("Verbindungsfehler")
            }
        }

        else {
            try {
                const response = await fetch(`http://10.10.70.105:8000/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (result.status === "success") {
                    setUsername(name);

                    if(result.isAdmin) {
                        setAdmin(true)
                        navigate("/admindashboard")
                    }
                    else
                    {
                        navigate("/defaultdashboard")
                    }

                } else {
                    alert(result.message)
                }
            } catch (error) {
                console.error("Fehler:", error);
                alert("Verbindungsfehler")
            }
        }
    }

    return (
        <>
        <div className={styles.bg} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button className={styles.close} onClick={onClose}>X</button>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.authmethod}>
                        <div>
                            <input type="radio" id="login" value="login" checked={authMode === "login"} onChange={() => setAuthMode("login")} />
                            <label htmlFor="login">Einloggen</label>
                        </div>

                        <div>
                            <input type="radio" id="register" value="register" checked={authMode === "register"} onChange={() => setAuthMode("register")} />
                            <label htmlFor="register">Registrieren</label>
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
        </>
    );
}