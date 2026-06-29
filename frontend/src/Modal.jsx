import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './Modal.module.css'
import { AiOutlineClose } from "react-icons/ai";

export default function Modal({ text, onClose }) {
    const modalOpenref = useRef();

    const contents = {
        dsgvo: { title: "Datenschutz", content:(
            <>
            <h3>Wichtiger Hinweis zum Datenschutz, zur Vertraulichkeit und zur Datensicherheit</h3>
            <br />
                    <p>Dieses System nutzt zur Verarbeitung von Texteingaben und zur Generierung von Antworten eine rein lokale künstliche Intelligenz (KI) über die Software LM Studio innerhalb unseres geschlossenen Unternehmensnetzwerks.</p>
                    <p>Im Gegensatz zu herkömmlichen, cloudbasierten KI-Diensten (wie ChatGPT, Copilot oder Claude) unterscheidet sich diese Architektur maßgeblich in Bezug auf den Schutz sensibler Unternehmensdaten:</p>
                    <ul>
                        <li><strong>Keine Datenübertragung ins Internet:</strong> Alle eingegebenen Texte, Prompts, internen Dokumente, Quellcodes, Kundendaten oder sonstigen geschäftlichen Informationen werden ausschließlich auf unserer lokalen Hardware bzw. auf Servern in unserem eigenen lokalen Netzwerk (LAN) verarbeitet.</li>
                        <li><strong>Absoluter Schutz vor Daten-Leaks und Spionage:</strong> Da das System vollständig offline operiert und keine Verbindung zu zentralen Datenbanken externer KI-Anbieter herstellt, ist ein Abfließen (Leak) von Betriebs- und Geschäftsgeheimnissen ausgeschlossen.</li>
                        <li><strong>Kein KI-Training mit Unternehmensdaten:</strong> Die eingegebenen Informationen und Dokumente werden nicht dazu verwendet, um das zugrundeliegende Sprachmodell weiterzuentwickeln oder zu trainieren.</li>
                        <li><strong>Einhaltung von Compliance und DSGVO:</strong> Da keine Datenverarbeitung durch externe Dritte im Ausland stattfindet, entfallen die typischen datenschutzrechtlichen Risiken.</li>
                    </ul>
                    <p className={styles.hinweis}>Lokale Sprachmodelle können fehlerhafte, unvollständige oder irreführende Informationen generieren. Die Ergebnisse der KI dürfen nicht ungeprüft in geschäftliche Entscheidungen, offizielle Dokumente oder Kundenkommunikationen übernommen werden und ersetzen nicht den fachlichen Verstand.</p>
            </>
        )
         },
        hilfe: { title: "Bedienung und Tips", content:(
<>
<h3>Leitfaden zur optimalen Nutzung der lokalen KI</h3>
            <p>Unsere lokale KI liefert die besten Ergebnisse, wenn deine Anfragen (Prompts) klar strukturiert sind. Nutze diese bewährten Best Practices:</p>
            
            <br />
            <h4>Das "Rolle-Kontext-Aufgabe"-Prinzip</h4>
            <p>Sag der KI genau, wer sie ist und wofür du das Ergebnis brauchst. Das verbessert die Qualität enorm:</p>
            <ul>
                <li><strong>Rolle:</strong> "Agiere als erfahrener Softwareentwickler..." oder "Du bist Marketing-Experte..."</li>
                <li><strong>Kontext:</strong> "...für ein internes Projekt im Bereich X..."</li>
                <li><strong>Aufgabe:</strong> "...erstelle mir eine verständliche Zusammenfassung."</li>
            </ul>

            <br />
            <h4>Formatierung der Ausgabe vorgeben</h4>
            <p>Du kannst der KI exakt vorschreiben, in welcher Form du die Antwort haben möchtest:</p>
            <ul>
                <li>"Gib das Ergebnis als übersichtliche HTML-Tabelle aus."</li>
                <li>"Erstelle eine Bullet-Point-Liste, sortiert nach Priorität."</li>
                <li>"Schreibe die Antwort als kurze, formelle E-Mail-Vorlage."</li>
            </ul>

            <br />
            <h4>Iteratives Arbeiten (Nachbessern)</h4>
            <p>Die erste Antwort ist selten perfekt. Du kannst das Ergebnis in Folge-Anfragen schrittweise verfeinern:</p>
            <ul>
                <li>"Schreibe das etwas kürzer und weniger technisch."</li>
                <li>"Füge zu Punkt 2 noch ein konkretes Praxisbeispiel hinzu."</li>
                <li>"Formuliere den Tonfall etwas diplomatischer."</li>
            </ul>

            <br />
            <h4>Tipp zur Sprache</h4>
            <p>Da viele Open-Source-Modelle primär mit englischen Daten trainiert wurden, sind sie bei komplexen logischen Aufgaben oder beim Programmieren (Coding) auf Englisch oft noch präziser. Bei Bedarf kannst du die KI das Ergebnis danach einfach auf Deutsch übersetzen lassen.</p>
</>
        ) },
        feedback: { title: "Feedback", content: "Feedback" }
    }

    // useEffect(() => {
    //     function clickOutside(e) {
    //         if (modalOpenref.current) {
    //             const clickedInsideMenu = modalOpenref.current.contains(e.target);
    //             if (!clickedInsideMenu) {
    //                onClose()
    //             }
    //         }
    //     }

    //     document.addEventListener('mousedown', clickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', clickOutside);
    //     };
    // }, [onClose])
    
    return (
        <>
        <div className={styles.modalBg} onClick={onClose}>
             <div className={styles.modal} ref={modalOpenref} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.title}>{contents[text].title}</div>
                    <div className={styles.close}><button onClick={() => onClose()}><AiOutlineClose/></button></div>
                </div>
                <div className={styles.content}>{contents[text].content}</div>
            </div>
        </div>
           
        </>
    )
}