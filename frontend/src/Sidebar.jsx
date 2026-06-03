import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState } from "react";

import { RxHamburgerMenu, RxGear, RxSun, RxMoon} from "react-icons/rx";
import { getStore } from "./Store.jsx";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const {theme, setTheme, temperature, setTemperature} = getStore();

    return (
        <>
            <div className={styles.sidebar} style={{ minWidth: sidebarOpen ? "15vw" : "5vw" }}>
                <div className={styles.header}>
                    <a href="/"><img className={styles.icon} src={icon} alt="Your Ai" /></a>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)  }><RxHamburgerMenu /></button>
                    <button onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
                    <div className={styles.temperature}>
                             <select name="temperature" id="temperature" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                            <option value="0.1">Schnelles Denken</option>
                            <option value="0.7">Präzises Denken</option>
                            <option value="1.9">Tiefgründiges Denken</option>
                        </select>
                    </div>
                  
                </div>
                <div className="footer">
                    <button onClick={() => setSettingsOpen(!settingsOpen)}><RxGear /></button>
                    {settingsOpen && <div className={styles.settings}>
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