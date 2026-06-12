import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState, useEffect, useRef } from "react";
import Accessiblity from './Accessibility.jsx';
import { RxHamburgerMenu, RxGear, RxSun, RxMoon } from "react-icons/rx";
import { getStore } from "./Store.jsx";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsOpenRef = useRef();
    const { theme, setTheme, temperature, setTemperature } = getStore();

    useEffect(() => {
        function clickOutside(e) {
            if (settingsOpenRef.current) {
                const clickedInsideMenu = settingsOpenRef.current.contains(e.target);
                const clickedOnButton = e.target.closest(`.${styles.sidebarBtn}`);
                if (!clickedInsideMenu && !clickedOnButton) {
                    setSettingsOpen(false)
                }
            }
        }
        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [])

    return (
        <>
            <div className={styles.sidebar} style={{ width: sidebarOpen ? "15vw" : "9vw" }}>
                <div className={styles.header}>
                    <a href="/"><img className={styles.icon} src={icon} alt="Your Ai" /></a>
                    <button className={styles.sidebarBtn} title="Menü" onClick={() => setSidebarOpen(!sidebarOpen)}><RxHamburgerMenu /></button>
                    <button className={styles.sidebarBtn} title="Farbbmodus wechseln" onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
                    <select className={styles.temperature} name="temperature" id="temperature" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                        <option value="0.1">Schnelles Denken</option>
                        <option value="0.7">Präzises Denken</option>
                        <option value="1.9">Tiefgründiges Denken</option>
                    </select>
                    {<Accessiblity />}
                </div>
                <div className="footer">
                    <button className={styles.sidebarBtn} title="Einstellungen" onClick={() => { setSettingsOpen(!settingsOpen); setSubmenuOpen(false); }}><RxGear /></button>
                    {settingsOpen && <div className={styles.settings} ref={settingsOpenRef}>
                        <ul>
                            <li><a href="#">Sprachsteuerung</a></li>
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