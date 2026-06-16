import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState, useEffect, useRef } from "react"
import Accessiblity from './Accessibility.jsx';
import { RxHamburgerMenu, RxPencil2, RxGear, RxSun, RxMoon } from "react-icons/rx"
import { getStore } from "./Store.jsx"

export default function Sidebar() {
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
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <img className={styles.icon} src={icon} alt="Your Ai" />
                    <button className={styles.sidebarBtn} title="Neuer Chat" onClick={() => {
                        const confirm = window.confirm("Neuer Chat");
                        if (confirm) { window.location.href = "/" }
                    }
                    }
                    ><RxPencil2 />
                    </button>
                    <button className={styles.sidebarBtn} title="Farbbmodus wechseln" onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
                    <select className={styles.temperature} name="temperature" id="temperature" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                        <option value="0.1">Schnelles Denken</option>
                        <option value="0.7">Präzises Denken</option>
                        <option value="1.9">Tiefgründiges Denken</option>
                    </select>
                    {<Accessiblity />}
                </div>
                <div>
                    <button className={styles.sidebarBtn} title="Einstellungen" onClick={() => { setSettingsOpen(!settingsOpen) }}><RxGear /></button>
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