import React, { use } from 'react'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import styles from "./AdminDashboard.module.css"
import { RxExit } from "react-icons/rx";
import { getStore } from "../Store";

export default function AdminDashboard() {
    const { username } = getStore()
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [date, setDate] = useState();

    //  useEffect(() => {
    //         if (!username) {
    //             navigate('/');
    //         }
    //     }, [username, navigate]);

    useEffect(() => {
        async function adminInfos() {
            try {
                const response = await fetch(`http://172.16.16.106:8000/admininfos`);
                const data = await response.json();
                setUsers(data.users);
                // const dateEnglish = new Date(data.date);
                // const dateGerman = dateEnglish.toLocaleDateString('de-DE')

                setReports(data.reports);
            } catch (error) {
                console.error("Error fetching admin infos:", error);
            }
        } adminInfos();
    }, []);

    return (
        <>
            <div className={styles.topbar}>
                <h2>Adminpanel</h2>
                <button> <RxExit /> Abmelden</button>
            </div>

            <div className={styles.main}>
                <h5>Benutzer</h5>
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>Vorname</th>
                            <th>Nachname</th>
                            <th>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user[0]}</td>
                                <td>{user[1]}</td>
                                <td>{new Date(user[4]).toLocaleDateString('de-DE')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>



                <div className={styles.allreports}>
                    <h5>All Reports</h5>
                    <ul>
                        {reports.map((report, index) => (
                            <li key={index}>ID: {report[0]} - Title: {report[1]}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}