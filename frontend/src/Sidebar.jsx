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
    const { theme, setTheme } = getStore();

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

        document.addEventListener('mouseup', clickOutside);
        return () => {
            document.removeEventListener('mouseup', clickOutside);
        };
    }, [])

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <img className={styles.icon} src={icon} alt="Your Ai" />
                    <button className={styles.sidebarBtn} title ="Neuer Chat" onClick={() => { window.location.href = "/" }}><RxPencil2 /> Neuer Chat</button>
                    <button className={styles.sidebarBtn} title ="Farbmodus" onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />} Farbmodus</button>
                </div>

                <div className={styles.footer}>
                    <button className={styles.sidebarBtn} title="Einstellungen" onClick={() => { setSettingsOpen(!settingsOpen) }}><RxGear /> Einstellungen</button>
                    {settingsOpen && <div className={styles.settings} ref={settingsOpenRef}>
                        <button className={styles.settingsBtn} onClick={() => setModalText("dsgvo")}>Datenschutz</button>
                        <button className={styles.settingsBtn} onClick={() => setModalText("hilfe")}>Bedienung und Tips </button>
                        <button className={styles.settingsBtn} onClick={() => setModalText("feedback")}>Feedback</button>
                    </div>}
                </div>
            </div>  
             {modalText && <Modal text={modalText} onClose={() => setModalText("")}/>}
        </>
    )
}