import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState, useEffect, useRef } from "react"
import SettingsModal from './SettingsModal.jsx'
import { RxPencil2, RxSun, RxMoon, RxBarChart, RxInfoCircled ,RxGear } from "react-icons/rx"
import Informations from './Informations.jsx'
import InformationModal from './InformationModal.jsx'
import { getStore } from "./Store.jsx"

export default function Sidebar() {
    const [openInformationsMenu, setOpenInformationsMenu] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsOpenRef = useRef();
    const [modalText, setModalText] = useState("")
    const [informationModalText, setInformationModalText] = useState("")
    const { theme, setTheme , username} = getStore();

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
                    <button className={styles.sidebarBtn} onClick={() => { window.location.href = "/" }}><RxPencil2 /> <span className={styles.sidebarBtnSpan}>Neuer Chat</span></button>
                    <button className={styles.sidebarBtn} onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />} <span className={styles.sidebarBtnSpan}>Farbmodus</span> </button>
                    <button className={styles.sidebarBtn} id="stats" onClick= {() => setOpenInformationsMenu(!openInformationsMenu)}> <RxBarChart /> <span className={styles.sidebarBtnSpan}>Statistiken</span> </button>
                </div>

                <div className={styles.footer}>
                    <button className={styles.sidebarBtn} onClick={() => { setSettingsOpen(!settingsOpen) }}><RxInfoCircled /> <span className={styles.sidebarBtnSpan}>Informationen</span></button>
                    {settingsOpen && <div className={styles.settings} ref={settingsOpenRef}>
                        <button className={styles.settingsBtn} onClick={() => setModalText("dsgvo")}>Datenschutz</button>
                        <button className={styles.settingsBtn} onClick={() => setModalText("hilfe")}>Bedienung und Tips </button>
                        <button className={styles.settingsBtn} onClick={() => setModalText("about")}>About</button>
                        <button className={styles.settingsBtn} onClick={() => setModalText("version")}>Version</button>
                    </div>}
                </div>
            </div>
            {openInformationsMenu && <Informations onClose={() => setOpenInformationsMenu(false)}/>}
            {modalText && <SettingsModal text={modalText} onClose={() => setModalText("")} />}
            {informationModalText && <InformationModal text={informationModalText} onClose={() => setInformationModalText("")} />}
        </>
    )
}