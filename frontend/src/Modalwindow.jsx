import { useRef } from "react"
import { AiOutlineClose } from "react-icons/ai";
import styles from './Modalwindow.module.css'
import { getStore } from "./Store";

export default function ModalWindow({ text, onClose }) {
    const modalOpenref = useRef();

    const contents = {
        dsgvo: {
            title: "Datenschutz", content: (
                <>
                    <p>Dieses System nutzt zur Verarbeitung von Texteingaben und zur Generierung von Antworten ein lokales Sprachmodell über die Software LM Studio innerhalb unseres geschlossenen Unternehmensnetzwerks.</p>
                    <p>Im Gegensatz zu herkömmlichen, cloudbasierten KI-Diensten unterscheidet sich diese Architektur maßgeblich in Bezug auf den DSGVO Aspekt.</p>

                    <br />
                    <p>Keine Datenübertragung ins Internet: Alle eingegebenen Texte, internen Dokumente, Quellcodes, Kundendaten oder sonstigen geschäftlichen Informationen werden ausschließlich auf unserer lokalen Hardware bzw. auf Servern in unserem eigenen lokalen Netzwerk verarbeitet.</p> <br />
                    <p>Absoluter Schutz vor Datenleaks und Spionage: Da das System vollständig offline arbeitet und keine Verbindung zu zentralen Datenbanken externer Anbieter herstellt, ist ein Abfließen von Betriebs- und Geschäftsgeheimnissen ausgeschlossen.</p> <br />
                    <p>Einhaltung der Richtlinien: Da keine Datenverarbeitung durch externe Dritte im Ausland stattfindet, entfallen die typischen datenschutzrechtlichen Risiken.</p>

                    <br />
                    <p className={styles.hinweis}>Lokale Sprachmodelle können fehlerhafte, unvollständige oder irreführende Informationen generieren. Die Ergebnisse der KI sollten daher nicht ungeprüft in geschäftliche Entscheidungen, offizielle Dokumente oder Kundenkommunikationen übernommen werden und ersetzen nicht den fachlichen Verstand.</p>
                </>
            )
        },
        hilfe: {
            title: "Bedienung und Tips", content: (
                <>
                    <p>Das Sprachmodell liefert die besten Ergebnisse, wenn deine Prompts klar strukturiert sind. Nutze diese bewährten Tricks:</p>

                    <br />
                    <h3>Rolle Prinzip</h3>
                    <p>Sag der KI genau, wer sie ist und wofür du das Ergebnis brauchst. Das verbessert die Qualität enorm.</p>
                    <p>Rolle: "Agiere als erfahrener Softwareentwickler" oder "Du bist Marketing-Experte"</p>
                    <p>Kontext: "Für ein internes Projekt im Bereich X"</p>
                    <p>Aufgabe: "Erstelle mir eine verständliche Zusammenfassung"</p>

                    <br />
                    <h3>Formatierung der Ausgabe vorgeben</h3>
                    <p>Du kannst exakt vorschreiben, in welcher Form du die Antwort haben möchtest.</p>
                    <p>Tabellen: "Gib das Ergebnis als übersichtliche HTML-Tabelle aus."</p>
                    <p>Listen: "Erstelle eine Liste, sortiert nach Priorität."</p>
                    <p>Vorlagen: "Schreibe die Antwort als kurze, formelle E-Mail-Vorlage."</p>

                    <br />
                    <h3>Nachbearbeitung</h3>
                    <p>Die erste Antwort ist selten perfekt. Du kannst das Ergebnis schrittweise verfeinern.</p>
                    <p>Kürzen: "Schreibe das etwas kürzer und weniger technisch"</p>
                    <p>Erweitern: "Füge zu diesem Punkt noch ein konkretes Praxisbeispiel hinzu"</p>
                    <p>Formulierung: "Formuliere das ganze etwas diplomatischer"</p>

                    <br />
                    <h3>Tipps zur Sprache</h3>
                    <p>Da viele Open-Source-Modelle primär mit englischen Daten trainiert wurden, sind sie bei komplexen logischen Aufgaben oder beim Programmieren auf Englisch oft noch präziser. Bei Bedarf kannst du die KI das Ergebnis danach einfach auf Deutsch übersetzen lassen.</p>
                </>
            )
        },
        about: {
            title: "About", content: (
                <>
                    <p>Aktuelle Version: v1.1</p>
                    <p>Veröffentlichung: 01. Oktober 2026</p>
                    <p>Lizensierung: MIT Open Source Lizenz</p>
                    <br />
                    <h3>Urheberrecht (c) 2026 snutig GmbH</h3>

                    <br />
                    <h3>Code und Repository</h3>
                    <p>GitHub: <a href="https://github.com/MPalamut/Ai" target="_blank" rel="noreferrer">github.com/MPalamut/Ai</a></p>
                    <p>Lizenz: MIT Lizenz (Freie Nutzung und Modifikation)</p>

                    <br />
                    <h3>Kontakt</h3>
                    <p>Entwickler: Murat Palamut</p>
                    <p>E-Mail: murat.palamut@snutig.de</p>
                    <br />
                    <p>
                        Jedem, der eine Kopie dieser Software und der zugehörigen Dokumentationsdateien erhält, wird hiermit kostenlos die Erlaubnis erteilt,
                        ohne Einschränkung mit der Software zu handeln, einschließlich und ohne Einschränkung der Rechte zur Nutzung, zum Kopieren, Ändern, Zusammenführen,
                        Veröffentlichen, Verteilen, Unterlizenzieren und/oder Verkaufen von Kopien der Software, und Personen, denen die Software zur Verfügung gestellt wird,
                        dies unter den folgenden Bedingungen zu gestatten:
                        Der obige Urheberrechtshinweis und dieser Genehmigungshinweis müssen in allen Kopien oder wesentlichen Teilen der Software enthalten sein.
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