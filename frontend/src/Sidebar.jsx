import React from 'react'
import styles from "./Sidebar.module.css"
import icon from "./assets/icon.svg"
import { useState } from "react";
import Accessiblity from './Accessibility.jsx';
import { RxHamburgerMenu, RxGear, RxSun, RxMoon } from "react-icons/rx";
import { getStore } from "./Store.jsx";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [subMenuOpen, setSubmenuOpen] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const { theme, setTheme, temperature, setTemperature, textToSpeech, setTextToSpeech, speechLanguage, setSpeechLanguage, speechVolume, setSpeechVolume, speechRate, setSpeechRate, speechPitch, setSpeechPitch } = getStore();

    return (
        <>
            <div className={styles.sidebar} style={{ width: sidebarOpen ? "15vw" : "9vw" }}>
                <div className={styles.header}>
                    <a href="/"><img className={styles.icon} src={icon} alt="Your Ai" /></a>
                    <button className={styles.sidebarBtn}title="Menü" onClick={() => setSidebarOpen(!sidebarOpen)}><RxHamburgerMenu /></button>
                    <button className={styles.sidebarBtn}title="Farbbmodus wechseln" onClick={() => setTheme(theme === "root" ? "light" : "root")}>{theme === "root" ? <RxSun /> : <RxMoon />}</button>
                    <select className={styles.temperature} name="temperature" id="temperature" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                        <option value="0.1">Schnelles Denken</option>
                        <option value="0.7">Präzises Denken</option>
                        <option value="1.9">Tiefgründiges Denken</option>
                    </select>
                    {<Accessiblity />}
                </div>
                <div className="footer">
                    <button className={styles.sidebarBtn} title="Einstellungen" onClick={() => { setSettingsOpen(!settingsOpen); setSubmenuOpen(false); }}><RxGear /></button>
                    {settingsOpen && <div className={styles.settings}>
                        <ul>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); setVoiceOpen(true); setSubmenuOpen(true) }}>Sprachsteuerung</a></li>
                            <li><a href="#">Datenschutz</a></li>
                            <li><a href="#">Feedback</a></li>
                            <li><a href="#">Informationen</a></li>
                            <li><a href="#">Hilfe</a></li>
                        </ul>
                    </div>}

                    {voiceOpen && subMenuOpen && <div className={styles.voiceControl}>
                        <h4>Sprachsteuerung</h4>

                        <div>
                            <label htmlFor="speechLanguage"> Sprache  </label>
                            <select value={speechLanguage} onChange={(e) => setSpeechLanguage(e.target.value)}>
                                <option value="de-DE">Deutsch (de-DE)</option>
                                <option value="en-US">Englisch (en-US)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="volume">Lautstärke:</label>
                            <input type="range" id="volume" name="volume" min="0" max="2" step="0.1" value={speechVolume} onChange={(e) => setSpeechVolume(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="rate">Sprechgeschwindigkeit:</label>
                            <input type="range" id="rate" name="rate" min="0" max="2" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="pitch">Tonhöhe:</label>
                            <input type="range" id="pitch" name="pitch" min="0" max="2" step="0.1" value={speechPitch} onChange={(e) => setSpeechPitch(e.target.value)} />
                        </div>

                    </div>}
                </div>
            </div>
        </>
    )
}