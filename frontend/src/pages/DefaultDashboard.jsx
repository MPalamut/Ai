import React, { useState } from 'react'
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { RxExit } from "react-icons/rx";
import styles from "./DefaultDashboard.module.css"
import { getStore } from "../Store";

export default function DefaultDashboard() {
    const navigate = useNavigate();
    const [reportText, setReportText] = useState();
    const { username } = getStore()

    const report = async () => {
        const reportData = {
            username: username,
            reportText: reportText.trim()
        }
        try {
            const url = "http://10.10.70.105:8000/report"
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
           <div className={styles.topbar}>
                          <h2>{username}</h2>
                          <button onClick={() => navigate("/")}> <RxExit /> Abmelden</button>
                      </div>

            <div className={styles.main}>
                 <textarea  value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
            <button onClick={() => {report()}}>Bericht senden</button>
            </div>
        </>
    )
}