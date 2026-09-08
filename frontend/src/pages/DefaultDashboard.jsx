import React, { useState } from 'react'
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { RxExit } from "react-icons/rx";
import styles from "./DefaultDashboard.module.css"
import { getStore } from "../Store";

export default function DefaultDashboard() {
    const navigate = useNavigate();
    const [reportText, setReportText] = useState();
    const [registerDate, setRegisterDate] = useState();
    const [reports, setReports] = useState([]);
    const date = new Date();
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
        }
        fetchname()
    }, [])

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
                <button onClick={() => navigate("/")}> <RxExit /> Abmelden</button>
            </div>

            <div className={styles.main}>
                <div className={styles.sidebar}>
                    <div className={styles.date}>{date.toLocaleDateString("de-DE", { weekday: "long" })} {date.toLocaleDateString()}</div>
                    <div>{`Registrierdatum: ${new Date(registerDate).toLocaleDateString("de-DE")}`}</div>
                </div>

                <div className={styles.mainbar}>
                    <div className={styles.report}>
                        <textarea value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
                        <button onClick={() => { report() }}>Bericht senden</button>
                    </div>

                    <div>
                        <table>
                            <caption>Meine Reports</caption>
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
                    </div>

                </div>
            </div>


        </>
    )
}