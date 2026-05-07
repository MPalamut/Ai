import { useEffect, useState } from "react";
import "./Sidebar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxGear } from "react-icons/rx";
import { RxSun } from "react-icons/rx";
import { RxMoon } from "react-icons/rx";
import { getStore } from "./Store.jsx";


export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [models, setModels] = useState([])
    const {selectedModel, setSelectedModel, theme, toggleTheme} = getStore();

    useEffect(() => {
        async function fetchModels() {
            try {
                const url = "http://localhost:8000/models"
                const res = await fetch(url)
                const data = await res.json()
                setModels(data.data)
                setSelectedModel(data.data[0].id)
            }
            catch (error) {console.log(error)}
        }
        fetchModels();
    }, []);

    return (
        <>
            <div className="sidebar" style={{ width: sidebarOpen ? "250px" : "150px" }}>
                <div className="header">
                    <a href="/">Your Ai</a>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)  }><RxHamburgerMenu /></button>
                    <select name="models" id="models" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                        {models.filter(m => !m.id.includes("embedding")).map(m => (<option key={m.id}>{m.id}</option>))}
                    </select>
                    <button onClick={toggleTheme}>{theme == "root" ? <RxSun /> : <RxMoon />}</button>
                </div>
                <div className="footer">
                    <button onClick={() => setSettingsOpen(!settingsOpen)}><RxGear /></button>
                    {settingsOpen && <div className="settings">
                        <ul>
                            <li><a href="#">Design</a></li>
                            <li><a href="#">Datenschutz</a></li>
                            <li><a href="#">Feedback</a></li> 
                            <li><a href="#">Informationen</a></li>
                            <li><a href="#">Hilfe</a></li>
                        </ul>
                    </div>}
                </div>
            </div>
        </>
    )
}