import { useState, useRef } from "react"
import "./Input.css"
import { AiOutlineSend } from "react-icons/ai";
import { getStore } from "./Store";

export default function Input() {
    const [input, setInput] = useState("")
    const [previousResponse, setPreviousResponse] = useState("")
    const {output,addOutput} = getStore()
    const {selectedModel} = getStore()
    const {loading, setLoading} = getStore()
    const inputRef = useRef()

    const responseReceived = () => {
        setLoading(false);
        setTimeout(() => { inputRef.current.focus() }, 1)
    }
    setTimeout(() => { inputRef.current.focus() }, 1)

    async function Responses() {
        addOutput("user", input)
        setInput("")
        setLoading(true)

        const params = new URLSearchParams({
            input: input,
            selectedModel: selectedModel
        })
        if (previousResponse != "") { params.append("previousResponse", previousResponse) }

        try {
            const url = `http://localhost:8000/responses?${params.toString()}`
            const res = await fetch(url, { method: "POST" })
            const data = await res.json()
            const responseText = data.output[0].content[0].text
            const tokensUsed = data.usage.output_tokens
            const responseID = data.id
            addOutput("ai", responseText, tokensUsed)
            setPreviousResponse(responseID)
        } catch (error) { console.log(error) }
        responseReceived()
    }

    return (
        <>
            <div className={`inputContainer ${loading ? "loading" : ""}`}>
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
        </>
    )
}