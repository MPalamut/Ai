import React from 'react'
import { useState, useEffect, useRef } from "react"
import { getStore } from "./Store";

export default function FetchModels() {
    const [models, setModels] = useState([])
    const { selectedModel, setSelectedModel } = getStore()

    useEffect(() => {
        async function fetchModels() {
            try {
                const url = "http://172.16.16.106:8000/models"
                const res = await fetch(url)
                const data = await res.json()
                setModels(data.data)
                setSelectedModel(data.data[0].id)
            }
            catch (error) { console.log(error) }
        }
        fetchModels();
    }, []);

    return (
        <>
            <select name="models" id="models" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                {models.filter(m => !m.id.includes("embedding")).map(m => (<option key={m.id}>{m.id}</option>))}
            </select>
        </>
    )
}