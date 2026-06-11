import React from 'react'
import { createContext, useContext, useState, useEffect } from "react";
const AppContext = createContext();

export function AppProvider({ children }) {
    const [theme, setTheme] = useState("root")
    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [imageName, setImageName] = useState("")
    const [fileBase64, setFileBase64] = useState("")
    const [imageBase64, setImageBase64] = useState("")
    const [previousResponse, setPreviousResponse] = useState("")
    const [temperature, setTemperature] = useState(0.1)
    const [fontSize, setFontSize] = useState(.9)
    const [textToSpeech, setTextToSpeech] = useState(false)
    const [speechLanguage, setSpeechLanguage] = useState("de-DE")
    const [speechVolume, setSpeechVolume] = useState(1)
    const [speechRate, setSpeechRate] = useState(1)
    const [speechPitch, setSpeechPitch] = useState(1)

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])
    
    const values = {
        theme, setTheme,
        output, setOutput,
        loading, setLoading,
        fileName, setFileName,
        fileBase64, setFileBase64,
        imageName, setImageName,
        imageBase64, setImageBase64,
        previousResponse, setPreviousResponse,
        temperature, setTemperature,
        fontSize, setFontSize,
        textToSpeech, setTextToSpeech,
        speechLanguage, setSpeechLanguage,
        speechRate, setSpeechRate,
        speechVolume, setSpeechVolume,
        speechPitch, setSpeechPitch
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

export const getStore = () => useContext(AppContext)