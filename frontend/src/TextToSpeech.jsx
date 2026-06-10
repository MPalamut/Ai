import React from "react";
import { useEffect, useRef } from "react";
import styles from "./TextToSpeech.module.css";
import { RxSpeakerLoud, RxSpeakerOff } from "react-icons/rx";
import { getStore } from "./Store.jsx";

export default function TextToSpeech() {
    const { output, textToSpeech, setTextToSpeech, speechLanguage, speechRate,  speechVolume,  speechPitch,  } = getStore();

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

        if (!textToSpeech) {
            window.speechSynthesis.cancel();
        }
    }, [output, textToSpeech]);

    return (
        <>
            {/* <div className={styles.toggleWrap}>
                <input type="checkbox" id="texttospeech" name="texttospeech" checked={textToSpeech} onChange={(e) => setTextToSpeech(e.target.checked)} />
                <label htmlFor="texttospeech">Vorlesen</label>
            </div> */}
            <div className={styles.toggleWrap}>
                <button title="Audioausgabe" onClick={() => setTextToSpeech(!textToSpeech)}>
                    {textToSpeech ? <RxSpeakerLoud /> : <RxSpeakerOff />}
                </button> <span className={styles.toggleText}>{textToSpeech ? "Vorlesen: An" : "Vorlesen: Aus"}</span>
            </div>
        </>
    );
}