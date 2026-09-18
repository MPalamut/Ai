import { useState, useRef } from "react"
import { AiOutlineSend } from "react-icons/ai";
import MoreFeatures from "./MoreFeatures"
import FileAnalyse from "./FileAnalyse";
import FetchModels from './FetchModels';
import styles from "./Input.module.css"
import { getStore } from "./Store";

export default function Input() {
    const [input, setInput] = useState("")
    const [searchdocs, setSearchdocs] = useState(false)
    const inputRef = useRef()
    const { selectedModel, setOutput, previousResponse, setPreviousResponse, loading, fileName, fileBase64, imageBase64, setLoading, temperature, setGeneration, setCompleteTokens } = getStore()

    async function Responses() {
        console.log(searchdocs)
        setInput("")
        setOutput(prev => [...prev, { text: input }])
        setLoading(true)

        try {
            const requestData = {
                input: input.trim(),
                selectedModel: selectedModel,
                temperature: temperature,
                searchdocs: searchdocs
            };

            if (previousResponse) { requestData.previousResponse = previousResponse; }
            
            if (fileBase64) {
                requestData.fileName = fileName;
                requestData.file = fileBase64;
            }
            
            if (imageBase64) { requestData.image = imageBase64; }

            const url = "http://10.10.70.105:8000/responses"
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            })

            const data = await res.json()
            const responseText = data.output.find(i => i.type === "message").content[0].text;
            const tokensUsed = data.usage.total_tokens
            const responseID = data.id

            if (!previousResponse) { setPreviousResponse(responseID) }
            setOutput(prev => [...prev, { role: "ai", text: responseText, tokens: tokensUsed }])
            setGeneration(previous => previous + 1)
            setCompleteTokens(previous => previous + tokensUsed)

        } catch (error) { console.error(error) }
        setLoading(false)

        setTimeout(() => { inputRef.current.focus() }, 1)
    }

    return (
        <>
            <div className={`${styles.inputContainer} ${loading ? styles.loading : ""}`}>
                <div className={styles.inputHeader}>
                    <input id="prompt" ref={inputRef} type="text" placeholder={loading ? "Bitte warten" : "Frage stellen"} value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { setInput(e.target.value); Responses(); } }} disabled={loading}
                    />
                    <button className={styles.sendBtn} title="Senden" onClick={Responses} disabled={!input.trim()}><AiOutlineSend /></button>
                </div>
                <div className={styles.inputFooter}>
                    <div className={styles.inputFooterLeft}>
                        <FetchModels />
                        <div className={styles.searchdocs}>
                            <input type="checkbox" checked={searchdocs} onChange={(e) => { setSearchdocs(e.target.checked) }} /> <label>Interne Dokumente nutzen</label>
                        </div>
                        <MoreFeatures />

                    </div>
                    <div className={styles.inputFooterRight}>
                        <FileAnalyse />
                    </div>
                </div>
            </div>
        </>
    )
}