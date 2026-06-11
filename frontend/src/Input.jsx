import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Input.module.css"
import { AiOutlineSend } from "react-icons/ai";
import { getStore } from "./Store";
import FileUpload from "./FileUpload";

export default function Input() {
    const [input, setInput] = useState("")
    const inputRef = useRef()
    const [models, setModels] = useState([])
    const [selectedModel, setSelectedModel] = useState("")
    const { setOutput, previousResponse, setPreviousResponse, loading, fileBase64, imageBase64, setLoading, temperature } = getStore()

    useEffect(() => {
        async function fetchModels() {
            try {
                const url = "http://localhost:8000/models"
                const res = await fetch(url)
                const data = await res.json()
                setModels(data.data)
                setSelectedModel(data.data[0].id)
            }
            catch (error) { console.log(error) }
        }
        fetchModels();
    }, []);

    const responseReceived = () => {
        setLoading(false);
        setTimeout(() => { inputRef.current.focus() }, 1)
    }

    setTimeout(() => { inputRef.current.focus() }, 1)

    async function Responses() {
        setOutput(prev => [...prev, { text: input }])
        setInput("")
        setLoading(true)

        const requestData = {
            input: input.trim(),
            selectedModel: selectedModel,
            temperature: temperature
        };

        if (previousResponse) { requestData.previousResponse = previousResponse; }
        if (fileBase64) { requestData.file = fileBase64; }
        if (imageBase64) { requestData.image = imageBase64; }

        try {
            const url = "http://localhost:8000/responses"
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            })

            const data = await res.json()
            const responseText = data.output[1].content[0].text
            const tokensUsed = data.usage.output_tokens
            const responseID = data.id

            setOutput(prev => [...prev, { role: "ai", text: responseText, tokens: tokensUsed }])
            setPreviousResponse(responseID)
        } catch (error) { console.error(error)}
        responseReceived()
    }

    return (
        <>
            <div className={`${styles.inputContainer} ${loading ? styles.loading : ""}`}>
                <div className={styles.inputHeader}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={loading ? "Bitte warten" : "Frage stellen"}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { setInput(e.target.value); Responses(); } }}
                        disabled={loading}
                    />
                    <button onClick={Responses} disabled={!input.trim()}><AiOutlineSend /></button>
                </div>
                <div className={styles.inputFooter}>
                    <div className={styles.inputFooterLeft}>
                        <select name="models" id="models" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                            {models.filter(m => !m.id.includes("embedding")).map(m => (<option key={m.id}>{m.id}</option>))}
                        </select>
                    </div>
                    <div className={styles.inputFooterRight}>
                        <FileUpload />
                    </div>
                </div>
            </div>
        </>
    )
}