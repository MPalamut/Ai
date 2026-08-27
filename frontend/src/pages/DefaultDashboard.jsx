import React, { useState } from 'react'
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import styles from "./DefaultDashboard.module.css"
import { getStore } from "../Store";

export default function DefaultDashboard() {
    const [reportText, setReportText] = useState();
    const { username } = getStore()
    const navigate = useNavigate();

 
    const report = async () => {
        const reportData = {
            username: username,
            reportText: reportText.trim()
        }
        try {
            const url = "http://172.16.16.106:8000/report"
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
            <h2>Hi {username}</h2>
            <div className={styles.main}>
                 <textarea  value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
            <button onClick={() => {report()}}>Bericht senden</button>
            </div>
        </>
    )
}