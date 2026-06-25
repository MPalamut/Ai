import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Input.module.css"
import { AiOutlineSend, AiOutlineBars } from "react-icons/ai";
import MoreFeatures from "./MoreFeatures"
import FileUpload from "./FileUpload";
import { getStore } from "./Store";
import FetchModels from './FetchModels';

export default function Input() {
    const [input, setInput] = useState("")
    const inputRef = useRef()
    const abortControllerRef = useRef(null);
    const { selectedModel, setOutput, previousResponse, setPreviousResponse, loading, fileBase64, imageBase64, setLoading, temperature, setGeneration, setCompleteTokens } = getStore()

    setTimeout(() => { inputRef.current.focus() }, 1)

    async function Responses() {
        setInput("")
        setOutput(prev => [...prev, { text: input }])
        setLoading(true)

        try {
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            const requestData = {
                input: input.trim(),
                selectedModel: selectedModel,
                temperature: temperature
            };

            if (previousResponse) { requestData.previousResponse = previousResponse; }
            if (fileBase64) { requestData.file = fileBase64; }
            if (imageBase64) { requestData.image = imageBase64; }

            const url = "http://172.16.16.106:8000/responses"
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData),
                signal: signal
            })

            const data = await res.json()
            const responseText = data.output.find(i => i.type === "message").content[0].text;
            const tokensUsed = data.usage.total_tokens
            const responseID = data.id

            setOutput(prev => [...prev, { role: "ai", text: responseText, tokens: tokensUsed }])
            if (!previousResponse) { setPreviousResponse(responseID) }
            setGeneration(previous => previous + 1)
            setCompleteTokens(previous => previous + tokensUsed)

        } catch (error) { console.error(error) }
        setLoading(false)
        abortControllerRef.current = null;
        setTimeout(() => { inputRef.current.focus() }, 1)
    }

    return (
        <>
            <div className={`${styles.inputContainer} ${loading ? styles.loading : ""}`}>
                <div className={styles.inputHeader}>
                    <input
                        id="prompt"
                        ref={inputRef}
                        type="text"
                        placeholder={loading ? "Bitte warten" : "Frage stellen"}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { setInput(e.target.value); Responses(); } }}
                        disabled={loading}
                    />
                    <button className={styles.promtBtn} title="Prompt" onClick={Responses} disabled={!input.trim() && !loading}><AiOutlineSend /></button>
                </div>
                <div className={styles.inputFooter}>
                    <div className={styles.inputFooterLeft}>
                        <FetchModels/>
                        <MoreFeatures />
                        <FileUpload />
                    </div>
                    <div className={styles.inputFooterRight}>

                    </div>
                </div>
            </div>
        </>
    )
}