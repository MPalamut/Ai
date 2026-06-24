import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState, useEffect, useRef } from "react"
import Modal from './Modal.jsx'
import { RxPencil2, RxGear, RxSun, RxMoon } from "react-icons/rx"
import { getStore } from "./Store.jsx"

export default function Sidebar() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsOpenRef = useRef();
    const [modalText, setModalText] = useState("")
    const { theme, setTheme, temperature, setTemperature, generation, completeTokens } = getStore();

    useEffect(() => {
        function clickOutside(e) {
            if (settingsOpenRef.current) {
                const clickedInsideMenu = settingsOpenRef.current.contains(e.target);
                const clickedOnButton = e.target.closest(`.${styles.sidebarBtn}`);
                if (!clickedInsideMenu && !clickedOnButton) {
                    setSettingsOpen(false)
                    setModalText("")
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
                    <button className={styles.sidebarBtn} title ="Neuer Chat" onClick={() => {
                        const confirm = window.confirm("Neuer Chat");
                        if (confirm) { window.location.href = "/" }
                    }
                    }
                    ><RxPencil2 />
                    </button>
                    <button className={styles.sidebarBtn} title ="Farbmodus" onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
                    <select className={styles.temperature} title="Denkweise" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                        <option value="0.1">Schnelles Denken</option>
                        <option value="0.7">Präzises Denken</option>
                        <option value="1.9">Tiefgründiges Denken</option>
                    </select>

                    {generation > 0 &&
                        (<div className={styles.tokenInfo} >
                            <label title ="Durchläufe">Generationen: {generation}</label>
                            <label title="Gesamttoken">Gesamtverbrauch: {completeTokens}</label>
                        </div>
                        )
                    }
                </div>

                <div className={styles.footer}>
                    <button className={styles.sidebarBtn} title="Einstellungen" onClick={() => { setSettingsOpen(!settingsOpen) }}><RxGear /></button>
                    {settingsOpen && <div className={styles.settings} ref={settingsOpenRef}>
                        <button onClick={() => setModalText("dsgvo")}>Datenschutz</button>
                        <button onClick={() => setModalText("hilfe")}>Hilfe</button>
                        <Modal isOpen={modalText != ""} text={modalText}/>
                    </div>}
                </div>
            </div>
        </>
    )
}