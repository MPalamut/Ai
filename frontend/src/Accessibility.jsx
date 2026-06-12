import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./Accessibility.module.css"
import { BsUniversalAccessCircle } from "react-icons/bs"
import { getStore } from "./Store.jsx";

export default function Accessiblity() {
    const [accessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false)
    const accessibilityMenuOpenRef = useRef()
    const { output, fontSize, setFontSize, textToSpeech, setTextToSpeech, speechLanguage, setSpeechLanguage, speechVolume, setSpeechVolume, speechRate, setSpeechRate, speechPitch, setSpeechPitch } = getStore();

    useEffect(() => {
        if (textToSpeech && output.length > 0) {
            const cleanText = output[output.length - 1].text.replace(/\p{Emoji_Presentation}/gu, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = speechLanguage;
            utterance.volume = speechVolume;
            utterance.rate = speechRate;
            utterance.pitch = speechPitch;
            window.speechSynthesis.speak(utterance);
        }
    }, [output, textToSpeech]);

    useEffect(() => {
        function clickOutside(e) {
            if (accessibilityMenuOpenRef.current) {
                const clickedInsideMenu = accessibilityMenuOpenRef.current.contains(e.target);
                const clickedOnButton = e.target.closest(`.${styles.accBtn}`);
                if (!clickedInsideMenu && !clickedOnButton) {
                    setAccessibilityMenuOpen(false)
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
            <button className={styles.accBtn} title="accessiblity" onClick={() => { setAccessibilityMenuOpen(!accessibilityMenuOpen) }}>   <BsUniversalAccessCircle /></button>

            {accessibilityMenuOpen && <div className={styles.accMenu} ref={accessibilityMenuOpenRef}>
                <fieldset>
                    <legend>Schrift</legend>
                    <div>
                        <label htmlFor="font">Schriftgröße</label>
                        <input type="range" id="font" name="font" min=".6" max="2" step="0.1" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
                    </div>
                </fieldset>

                <fieldset>
                    <legend> Sprachsteuerung</legend>
                    <div className={styles.speech}>
                        <label htmlFor="speech"> Audioausgabe: </label>
                        <input type="checkbox" name="speech" id="speech" checked={textToSpeech} onChange={(e) => setTextToSpeech(e.target.checked)} />
                    </div>

                    <div>
                        <label htmlFor="speechLanguage">Sprache: </label>
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
                </fieldset>
            </div>}
        </>
    )
}