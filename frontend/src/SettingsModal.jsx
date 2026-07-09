import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './SettingsModal.module.css'
import { AiOutlineClose } from "react-icons/ai";
import { getStore } from "./Store";

export default function SettingsModal({ text, onClose }) {
    const [reportText, setReportText] = useState("");
    const modalOpenref = useRef();
    const { username } = getStore();

    useEffect(() => {
        if (text === "report" && !username) {
            alert("Bitte melde dich an, um einen Bericht zu senden");
            onClose();
        }
    }, [text, username, onClose]);

    const report = async () => {
        const reportData = {
            username: username,
            reportText: reportText.trim()
        }

        try {
            const url = "http://172.16.16.106:8000/report"
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reportData)
            })

            const data = await res.json()

            if (data.status === "success") {
                alert("Bericht erfolgreich gesendet")
                setReportText("")
            } else { alert("Fehler beim Senden des Berichts") }
        }
        catch (error) { console.log(error) }
    }

    const contents = {
        dsgvo: {
            title: "Datenschutz", content: (
                <>
                    <p>Dieses System nutzt zur Verarbeitung von Texteingaben und zur Generierung von Antworten eine rein lokale künstliche Intelligenz (KI) über die Software LM Studio innerhalb unseres geschlossenen Unternehmensnetzwerks.</p>
                    <p>Im Gegensatz zu herkömmlichen, cloudbasierten KI-Diensten (wie ChatGPT, Copilot oder Claude) unterscheidet sich diese Architektur maßgeblich in Bezug auf den Schutz sensibler Unternehmensdaten:</p>

                    <br />
                    <p><strong>Keine Datenübertragung ins Internet:</strong> Alle eingegebenen Texte, Prompts, internen Dokumente, Quellcodes, Kundendaten oder sonstigen geschäftlichen Informationen werden ausschließlich auf unserer lokalen Hardware bzw. auf Servern in unserem eigenen lokalen Netzwerk (LAN) verarbeitet.</p>
                    <p><strong>Absoluter Schutz vor Daten-Leaks und Spionage:</strong> Da das System vollständig offline operiert und keine Verbindung zu zentralen Datenbanken externer KI-Anbieter herstellt, ist ein Abfließen (Leak) von Betriebs- und Geschäftsgeheimnissen ausgeschlossen.</p>
                    <p><strong>Kein KI-Training mit Unternehmensdaten:</strong> Die eingegebenen Informationen und Dokumente werden nicht dazu verwendet, um das zugrundeliegende Sprachmodell weiterzuentwickeln oder zu trainieren.</p>
                    <p><strong>Einhaltung von Compliance und DSGVO:</strong> Da keine Datenverarbeitung durch externe Dritte im Ausland stattfindet, entfallen die typischen datenschutzrechtlichen Risiken.</p>

                    <br />
                    <p className={styles.hinweis}>Lokale Sprachmodelle können fehlerhafte, unvollständige oder irreführende Informationen generieren. Die Ergebnisse der KI dürfen nicht ungeprüft in geschäftliche Entscheidungen, offizielle Dokumente oder Kundenkommunikationen übernommen werden und ersetzen nicht den fachlichen Verstand.</p>
                </>
            )
        },
        hilfe: {
            title: "Bedienung und Tips", content: (
                <>
                    <p>Unsere lokale KI liefert die besten Ergebnisse, wenn deine Anfragen (Prompts) klar strukturiert sind. Nutze diese bewährten Best Practices:</p>

                    <br />
                    <h2>Das "Rolle-Kontext-Aufgabe"-Prinzip</h2>
                    <p>Sag der KI genau, wer sie ist und wofür du das Ergebnis brauchst. Das verbessert die Qualität enorm:</p>
                    <p><strong>Rolle:</strong> "Agiere als erfahrener Softwareentwickler..." oder "Du bist Marketing-Experte..."</p>
                    <p><strong>Kontext:</strong> "...für ein internes Projekt im Bereich X..."</p>
                    <p><strong>Aufgabe:</strong> "...erstelle mir eine verständliche Zusammenfassung."</p>

                    <br />
                    <h2>Formatierung der Ausgabe vorgeben</h2>
                    <p>Du kannst der KI exakt vorschreiben, in welcher Form du die Antwort haben möchtest:</p>
                    <p><strong>Tabellen:</strong> "Gib das Ergebnis als übersichtliche HTML-Tabelle aus."</p>
                    <p><strong>Listen:</strong> "Erstelle eine Bullet-Point-Liste, sortiert nach Priorität."</p>
                    <p><strong>Vorlagen:</strong> "Schreibe die Antwort als kurze, formelle E-Mail-Vorlage."</p>

                    <br />
                    <h2>Iteratives Arbeiten (Nachbessern)</h2>
                    <p>Die erste Antwort ist selten perfekt. Du kannst das Ergebnis in Folge-Anfragen schrittweise verfeinern:</p>
                    <p><strong>Kürzen:</strong> "Schreibe das etwas kürzer und weniger technisch."</p>
                    <p><strong>Erweitern:</strong> "Füge zu Punkt 2 noch ein konkretes Praxisbeispiel hinzu."</p>
                    <p><strong>Tonfall:</strong> "Formuliere den Tonfall etwas diplomatischer."</p>

                    <br />
                    <h2>Tipp zur Sprache</h2>
                    <p>Da viele Open-Source-Modelle primär mit englischen Daten trainiert wurden, sind sie bei komplexen logischen Aufgaben oder beim Programmieren (Coding) auf Englisch oft noch präziser. Bei Bedarf kannst du die KI das Ergebnis danach einfach auf Deutsch übersetzen lassen.</p>
                </>
            )
        },
        about: {
            title: "About", content: (
                <><h2>Frameworks</h2>
                    <p><strong>LM Studio API:</strong> Als lokale Schnittstelle für die Ausführung der Open-Source-Modelle.</p>
                    <p><strong>React & Vite:</strong> Für eine schnelle, reaktive Benutzeroberfläche als Frontend.</p>
                    <p><strong>FastAPI:</strong> Im Backend für eine asynchrone und blitzschnelle Kommunikation.</p>

                    <br />
                    <h2>Code und Repository</h2>
                    <p><strong>GitHub:</strong> <a href="https://github.com/MPalamut/Ai" target="_blank" rel="noreferrer">github.com/MPalamut/Ai</a></p>
                    <p><strong>Lizenz:</strong> MIT Lizenz (Freie Nutzung und Modifikation)</p>

                    <br />
                    <h2>Kontakt</h2>
                    <p><strong>Entwickler:</strong> Murat Palamut</p>
                    <p><strong>E-Mail:</strong> murat.palamut@snutig.de</p>
                </>
            )
        },
        version: {
            title: "Version", content: (
                <>
                    <p><strong>Aktuelle Version:</strong> v1.2</p>
                    <p><strong>Veröffentlichung:</strong> 01. Juli 2026</p>
                    <p><strong>Lizensierung</strong> MIT Open Source Lizenz</p>
                    <br />
                    <h2>Urheberrecht (c) 2026 snutig GmbH</h2>
                    <p> 
                        Hiermit wird jeder Person, die eine Kopie dieser Software besitzt, gebührenfrei die Erlaubnis erteilt,
                        uneingeschränkt mit der Software zu handeln, einschließlich, aber nicht beschränkt auf das Recht, sie zu nutzen, zu kopieren, zu modifizieren, zusammenzufügen,
                        zu veröffentlichen, zu verbreiten, unterzulizenzieren und/oder Kopien der Software zu verkaufen, und Personen, denen die Software zur Verfügung gestellt wird,
                        dies unter den folgenden Bedingungen zu gestatten:
                        Der obige Urheberrechtshinweis und dieser Erlaubnishinweis müssen in allen Kopien oder wesentlichen Teilen der Software enthalten sein.
                    </p>
                    <br />
                    <p>
                        Die Software wird ohne Mängelgewähr und ohne jegliche ausdrückliche oder implizierte Garantie zur Verfügung gestellt,
                        einschließlich, aber nicht beschränkt auf die Garantie der Marktgängigkeit, der Eignung für einen bestimmten Zweck und der Nichtverletzung von Rechten dritter.
                        In keinem Fall sind die Autoren oder Urheberrechtsinhaber für Ansprüche, Schäden oder sonstige Haftung haftbar, ob in Folge eines Vertrages,
                        einer unerlaubten Handlung oder anderweitig, die sich aus, oder in Verbindung mit der Software oder der Nutzung oder anderen Geschäften mit der Software ergeben.
                    </p>

                </>
            )
        },

        report: {
            title: "Bericht senden", content: (
                <>
                    <div className={styles.report}>
                        <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} cols="30" rows="10"></textarea>
                        <button className={styles.reportBtn} onClick={(e) => { report() }} disabled={reportText.trim() === ""}>Absenden</button>
                    </div>

                </>
            )
        }
    }

    return (
        <>
            <div className={styles.modalBg} onClick={onClose}>
                <div className={styles.modal} ref={modalOpenref} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <div className={styles.title}>{contents[text].title}</div>
                        <div className={styles.close}><button onClick={() => onClose()}><AiOutlineClose /></button></div>
                    </div>
                    <div className={styles.content}>{contents[text].content}</div>
                </div>
            </div>

        </>
    )
}