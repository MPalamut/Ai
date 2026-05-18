import React from 'react'
import { useEffect, useState } from "react";
import "./Sidebar.css";
import { RxHamburgerMenu, RxGear, RxSun, RxMoon} from "react-icons/rx";
import { getStore } from "./Store.jsx";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [models, setModels] = useState([])
    const {selectedModel, setSelectedModel, theme, setTheme} = getStore();

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
            <div className="sidebar" style={{ minWidth: sidebarOpen ? "15vw" : "5vw" }}>
                <div className="header">
                    <a href="/">Your Ai</a>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)  }><RxHamburgerMenu /></button>
                    <select name="models" id="models" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                        {models.filter(m => !m.id.includes("embedding")).map(m => (<option key={m.id}>{m.id}</option>))}
                    </select>
                    <button onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
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