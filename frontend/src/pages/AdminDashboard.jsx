import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import styles from "./AdminDashboard.module.css"
import { RxGear, RxExit } from "react-icons/rx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getStore } from "../Store";

export default function AdminDashboard() {
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
    const [visitCount, setVisitCount] = useState();
    const [documents, setDocuments] = useState([]);
    const [documentsAll, setDocumentsAll] = useState();
    const [openSettings, setOpenSettings] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newusername, setNewsusername] = useState("")
    const [newuserpassword, setNewuserpassword] = useState("")
    const [removeuserid, setRemoveuserid] = useState("")
    const [editreportid, setEditreportid] = useState()
    const [newDocumentName, setNewDocumentName] = useState("")
    const [newDocument, setNewDocument] = useState("")
    const { username } = getStore()

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
                setVisitCount(data.visitCount)
                setDocuments(data.documents);
                setDocumentsAll(data.documentsAll)

            } catch (error) {
                console.error("Error fetching admin infos:", error);
            }
        } adminInfos();
    }, []);

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

    const newUser = async () => {
        try {
            const response = await fetch("http://10.10.70.105:8000/newuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newusername: newusername,
                    newuserpassword: newuserpassword
                })
            })
            const result = await response.json()
            if (response.ok) {
                alert("Benutzer wurde angelegt")
            }
        }
        catch (error) { console.log("Error") }
    }

    const removeUser = async () => {
        try {
            const response = await fetch("http://10.10.70.105:8000/removeuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ removeuserid: removeuserid })
            })
            const result = await response.json()
            if (response.ok) {
                alert("Benutzer entfernt")
            }
        }
        catch (error) { console.log("Error") }
    }

    const editreport = async () => {
        try {
            const response = await fetch("http://10.10.70.105:8000/editreport", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ editreportid: editreportid })
            })
            const result = await response.json()
            if (response.ok) {
                alert("Report bearbeitet")
            }
        }
        catch (error) { console.log("Error") }
    }

    const handleFileChange = (event) => {
        setNewDocument("")
        const file = event.target.files[0];
        if (file) {
            setNewDocumentName(file.name)
            const reader = new FileReader();
            reader.onloadend = () => { setNewDocument(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSave = async () => {
        if (newDocument) {
            const requestData = {
                fileName: newDocumentName,
                file: newDocument
            }

            const url = "http://10.10.70.105:8000/newDocument"
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            })
            alert("document saved")
        }
    }

    const formatedDates = tokens.map(item => ({
        id: item[0],
        datum: item[1],
        prompts: item[2]
    }))

    return (
        <>
            <div className={styles.topbar}>
                <h2>Adminpanel</h2>
                <div className={styles.right}>
                    <button onClick={() => setOpenSettings(!openSettings)}> <RxGear /> Einstellungen</button>
                    <button onClick={() => navigate("/")}> <RxExit /> Abmelden</button>

                    {openSettings && <div className={styles.settings}>
                        <div><input id="altesPasswort" type="password" placeholder='Altes Passwort' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
                        <div><input id="neuesPasswort" type="password" placeholder='Neues Passwort' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                        <div><input id="neuesPasswort" type="password" placeholder='Neues Passwort wiederholen' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                        <button onClick={handleClick}> Passwort ändern</button>
                    </div>
                    }
                </div>
            </div>

            <div className={styles.main}>
                <div className={styles.sidebar}>
                    <div className={styles.date}>{new Date().toLocaleDateString("de-DE", { weekday: "long" })} {new Date().toLocaleDateString()}</div>
                    <div className={styles.infos}>
                        <div><span>Registrierte Benutzer: </span> <span>{usercount}</span></div><br />
                        <div><span>Reports: </span> <span>{reportcount}</span></div><br />
                        <div><span>Prompts heute: </span> <span>{promptsDaily}</span></div>
                        <div><span>Prompts insgesamt:</span>  <span> {promptsAll}</span> </div><br />
                        <div><span>Tokenverbrauch heute: </span> <span>{tokencountdaily}</span></div>
                        <div><span>Tokenverbrauch insgesamt </span> <span>{tokencountall}</span></div><br />
                        <div><span>Einzigartige Besucher </span> <span>{visitCount}</span></div><br />
                        <div><span>Dokumente </span> <span>{documentsAll}</span></div>
                    </div>
                </div>

                <div className={styles.diagramms}>
                    <div className={styles.tables}>
                        <table>
                            <caption>Benutzer</caption>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Registrierungsdatum</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user[0]}</td>
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
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Report</th>
                                    <th>Status</th>
                                    <th>Datum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, index) => (
                                    <tr key={index}>
                                        <td>{report[0]}</td>
                                        <td>{report[6]}</td>
                                        <td>{report[1]}</td>
                                        <td>{report[2]}</td>
                                        <td>{new Date(report[3]).toLocaleDateString('de-DE')}</td>
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
                            <caption>Besucher</caption>
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
                                        <td>{new Date(document[3]).toLocaleDateString('de-DE')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.edit}>
                        <fieldset>
                            <legend>Benutzer anlegen</legend>
                            <input type="text" placeholder='Neuer Benutzer' value={newusername} onChange={(e) => setNewsusername(e.target.value)} />
                            <input type="password" placeholder='Passwort' value={newuserpassword} onChange={(e) => setNewuserpassword(e.target.value)} />
                            <button onClick={newUser}>Benutzer anlegen</button>
                        </fieldset>

                        <fieldset>
                            <legend>Benutzer löschen</legend>
                            <input type="text" placeholder='Benutzer Id' value={removeuserid} onChange={(e) => setRemoveuserid(e.target.value)} />
                            <button onClick={removeUser}>Benutzer löschen</button>
                        </fieldset>

                        <fieldset>
                            <legend>Reports bearbeiten</legend>
                            <input  type="text" placeholder='Report Id' value={editreportid} onChange={(e) => setEditreportid(e.target.value)} />
                            <button onClick={editreport}>Report bearbeiten</button>
                        </fieldset>

                        <fieldset>
                            <legend>Dokument speichern</legend>
                            <input type="file" accept=".pdf, .docx" onChange={handleFileChange} />
                            <button onClick={handleFileSave}>Dokument speichern</button>
                        </fieldset>
                    </div>

                    <div className="chart"><div style={{ width: '100%', height: 400, padding: '20px', background: '#b2b9bfff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontFamily: 'sans-serif', fontSize: '18px', marginBottom: '20px', color: '#2a2a2aff' }}> Prompts insgesamt </h2>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={formatedDates}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="datum" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="prompts" fill="#0074c8ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </div>

                </div>
            </div>
        </>
    )
}
