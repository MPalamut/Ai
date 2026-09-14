import React, { useState } from 'react'
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { RxGear, RxExit } from "react-icons/rx";
import styles from "./DefaultDashboard.module.css"
import { getStore } from "../Store";

export default function DefaultDashboard() {
    const navigate = useNavigate();
    const [reportText, setReportText] = useState();
    const [registerDate, setRegisterDate] = useState();
    const [reports, setReports] = useState([]);
    const [reportCount, setReportCount] = useState();
    const [tokens, setTokens] = useState([]);
    const [tokenCount, setTokenCount] = useState()
    const [openSettings, setOpenSettings] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { username } = getStore()

    useEffect(() => {
        const fetchname = async () => {
            const url = `http://10.10.70.105:8000/defaultinfos?username=${username}`
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const data = await res.json()
            setRegisterDate(data.registerDate)
            setReports(data.reports)
            setReportCount(data.reportCount)
            setTokens(data.tokens)
            setTokenCount(data.tokenCount)
        }
        fetchname()
    }, [])

    const handleClick = async () => {
        if (newPassword == confirmPassword) {
            try {
                const response = await fetch("http://10.10.70.105:8000/changepassword", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: username,
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    })
                })
                const result = await response.json()
                if (response.ok) {
                    alert("Passwort geändert")
                    setOpenSettings(false)
                }
            }
            catch (error) { console.log("Error") }
        }
    }
    const report = async () => {
        const reportData = {
            username: username,
            reportText: reportText.trim()
        }
        try {
            const url = "http://10.10.70.105:8000/report"
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData)
            })

            const data = await res.json()

            if (data.status === "success") {
                alert("Bericht erfolgreich gesendet")
                setReportText("")
            } else { alert("Fehler beim Senden des Berichts") }
        }
        catch (error) { console.log(error) }
    }

    return (
        <>
            <div className={styles.topbar}>
                <h2>{username}</h2>
                <div className={styles.right}>
                    <button onClick={() => setOpenSettings(!openSettings)}> <RxGear />Einstellungen</button>
                    <button onClick={() => navigate("/")}> <RxExit /> Abmelden</button>

                    {openSettings && <div className={styles.settings}>
                        <div><input id="altesPasswort" type="password" placeholder='Altes Passwort' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
                        <div><input id="neuesPasswort" type="password" placeholder='Neues Passwort' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                        <div><input id="neuesPasswort" type="password" placeholder='Neues Passwort wiederholen' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                        <button onClick={handleClick}> Passwort ändern</button>
                    </div>
                    }
                </div>
                {/* <button onClick={() => navigate("/")}> <RxExit /> Abmelden</button> */}
            </div>

            <div className={styles.main}>
                <div className={styles.sidebar}>
                    <div className={styles.date}>{new Date().toLocaleDateString("de-DE", { weekday: "long" })} {new Date().toLocaleDateString()}</div>
                    <div className={styles.infos}>
                        <div><span>Reports: </span> <span>{reportCount}</span></div><br />
                        <div><span>Tokens: </span> <span>{tokenCount}</span></div>
                    </div>
                </div>

                <div className={styles.mainbar}>
                    <div className={styles.report}>
                        <div><h2>Report senden</h2></div>
                        <div className={styles.reportfield}>
                            <textarea value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
                        <button onClick={() => { report() }}>Report senden</button>
                        </div>
                    </div>

                    <div className={styles.tables}>
                        <table>
                            <caption>Reports</caption>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Report</th>
                                    <th>Datum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, index) => (
                                    <tr key={index}>
                                        <td>{report[5]}</td>
                                        <td>{report[1]}</td>
                                        <td>{new Date(report[2]).toLocaleDateString("de-DE")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <table>
                            <caption>Tokens</caption>
                            <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Token</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokens.map((token, index) => (
                                    <tr key={index}>
                                        <td>{new Date(token[1]).toLocaleDateString("de-DE")}</td>
                                        <td>{token[2]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </>
    )
}