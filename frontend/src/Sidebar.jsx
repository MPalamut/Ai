import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState } from "react";
import TextToSpeech from "./TextToSpeech.jsx";
import { RxHamburgerMenu, RxGear, RxSun, RxMoon } from "react-icons/rx";
import { getStore } from "./Store.jsx";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const { theme, setTheme, temperature, setTemperature, textToSpeech, setTextToSpeech, speechLanguage, setSpeechLanguage ,speechVolume, setSpeechVolume, speechRate, setSpeechRate } = getStore();

    return (
        <>
            <div className={styles.sidebar} style={{ width: sidebarOpen ? "15vw" : "9vw" }}>
                <div className={styles.header}>
                    <a href="/"><img className={styles.icon} src={icon} alt="Your Ai" /></a>
                    <button title="Menü" onClick={() => setSidebarOpen(!sidebarOpen)}><RxHamburgerMenu /></button>
                    <button title="Farbbmodus wechseln" onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
                    <select className={styles.temperature} name="temperature" id="temperature" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                        <option value="0.1">Schnelles Denken</option>
                        <option value="0.7">Präzises Denken</option>
                        <option value="1.9">Tiefgründiges Denken</option>
                    </select>
                    <TextToSpeech />
                </div>
                <div className="footer">
                    <button title="Einstellungen" onClick={() => setSettingsOpen(!settingsOpen)}><RxGear /></button>
                    {settingsOpen && <div className={styles.settings}>
                        <ul>
                            <li><a href="#" 
                            onClick={(e) => { e.preventDefault(); setVoiceOpen(!voiceOpen); }}>Sprachsteuerung</a>
                            
                            
                            </li>
                            <li><a href="#">Datenschutz</a></li>
                            <li><a href="#">Feedback</a></li>
                            <li><a href="#">Informationen</a></li>
                            <li><a href="#">Hilfe</a></li>
                        </ul>
                    </div>}
                    {voiceOpen && <div className={styles.voiceControl}>
                        <h4>Sprachsteuerung</h4>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Aktivieren
                            <input type="checkbox" checked={textToSpeech} onChange={(e) => setTextToSpeech(e.target.checked)} />
                        </label>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Sprache
                            <select value={speechLanguage} onChange={(e) => setSpeechLanguage(e.target.value)}>
                                <option value="de-DE">Deutsch (de-DE)</option>
                                <option value="en-US">Englisch (en-US)</option>
                            </select>
                        </label>
                     <label htmlFor="lautstaerke">Lautstärke:</label>
                    <input type="range" id="lautstaerke" name="lautstaerke" min="0" max="100" value={speechVolume} onChange={(e) => setSpeechVolume(e.target.value)} />
                    </div>
                   
                    }
                    
                </div>
            </div>
        </>
    )
}