import React from 'react'
import { createContext, useContext, useState, useEffect } from "react";
const AppContext = createContext();

export function AppProvider({ children }) {
    const [theme, setTheme] = useState("root")
    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [base64String, setBase64String] = useState("")
    const [previousResponse, setPreviousResponse] = useState("")

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const values = {
        theme, setTheme,
        output, setOutput,
        loading, setLoading,
        fileName, setFileName,
        base64String, setBase64String,
        previousResponse, setPreviousResponse
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

export const getStore = () => useContext(AppContext)