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
    const [usercount, setUserCount] = useState();
    const [reports, setReports] = useState([]);
    const [reportcount, setReportcount] = useState();
    const [promptsDaily, setPromptsdaily] = useState();
    const [promptsAll, setPromptsAll] = useState();
    const [tokens, setTokens] = useState([]);
    const [tokencountdaily, setTokencountdaily] = useState();
    const [tokencountall, setTokencountall] = useState();
    const [visits, setVisits] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [documentsAll, setDocumentsAll] = useState();
    const date = new Date();

    useEffect(() => {
        async function adminInfos() {
            try {
                const response = await fetch(`http://10.10.70.105:8000/admininfos`);
                const data = await response.json();
                setUsers(data.users);
                setUserCount(data.usercount);
                setReports(data.reports);
                setReportcount(data.reportcount);
                setPromptsdaily(data.promptsDaily);
                setPromptsAll(data.promptsAll);
                setTokens(data.tokens);
                setTokencountdaily(data.tokensDaily);
                setTokencountall(data.tokensAll);
                setVisits(data.visits);
                setDocuments(data.documents);
                setDocumentsAll(data.documentsAll)

            } catch (error) {
                console.error("Error fetching admin infos:", error);
            }
        } adminInfos();
    }, []);

    return (
        <>
            <div className={styles.topbar}>
                <h2>Adminpanel</h2>
                <button onClick={() => navigate("/")}> <RxExit /> Abmelden</button>
            </div>

            <div className={styles.main}>
                
                <div className={styles.sidebar}>
                    <div className={styles.date}>{date.toLocaleDateString("de-DE", {weekday: "long"})} {date.toLocaleDateString()}</div>
                    <div className={styles.infos}>
                        <div><span>Registrierte Benutzer: </span> <span>{usercount}</span></div>
                        <div><span>Reports: </span> <span>{reportcount}</span></div><br />
                        <div><span>Prompts heute: </span> <span>{promptsDaily}</span></div>
                        <div><span>Prompts insgesamt:</span>  <span> {promptsAll}</span> </div><br />
                        <div><span>Tokenverbrauch heute: </span> <span>{tokencountdaily}</span></div>
                        <div><span>Tokenverbrauch insgesamt </span> <span>{tokencountall}</span></div><br />
                        <div><span>Dokumente </span> <span>{documentsAll}</span></div>
                    </div>
                </div>

                <div className={styles.tables}>
                    <table>
                        <caption>Benutzer</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Registrierungsdatum</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user[1]}</td>
                                    <td>{new Date(user[4]).toLocaleDateString('de-DE')}</td>
                                    <td>{user[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
                                    <td>{new Date(report[2]).toLocaleDateString('de-DE')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table>
                        <caption>Prompts</caption>
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Prompts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token, index) => (
                                <tr key={index}>
                                    <td>{new Date(token[1]).toLocaleDateString('de-DE')}</td>
                                    <td>{token[2]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table>
                        <caption>Visits</caption>
                        <thead>
                            <tr>
                                <th>Ip</th>
                                <th>Datum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.map((visit, index) => (
                                <tr key={index}>
                                    <td>{visit[1]}</td>
                                    <td>{new Date(visit[2]).toLocaleDateString('de-DE')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table>
                        <caption>Dokumente</caption>
                        <thead>
                            <tr>
                                <th>Dateiname</th>
                                <th>Datum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((document, index) => (
                                <tr key={index}>
                                    <td>{document[1]}</td>
                                    <td>{new Date(document[2]).toLocaleDateString('de-DE')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
        </>
    )
}