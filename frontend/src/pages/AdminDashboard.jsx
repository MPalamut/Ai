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
    const [tokens, setTokens] = useState([]);


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
                setReports(data.reports);
                setTokens(data.tokens);

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
                <table>
                    <caption>Benutzer</caption>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Registrierungsdatum</th>
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

                <table>
                    <caption>Reports</caption>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Report</th>
                            <th>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={index}>
                                <td>{report[0]}</td>
                                <td>{report[5]}</td>
                                <td>{report[1]}</td>
                                <td>{new Date(report[2]).toLocaleDateString('de-DE')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                 <table>
                    <caption>Prompts</caption>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Datum</th>
                            <th>Prompts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, index) => (
                            <tr key={index}>
                                <td>{token[0]}</td>
                                <td>{new Date(token[1]).toLocaleDateString('de-DE')}</td>
                                <td>{token[2]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    )
}