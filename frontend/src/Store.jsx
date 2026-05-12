import React from 'react'
import { createContext, useContext, useState, useEffect } from "react";
const AppContext = createContext();

export function AppProvider({ children }) {
    const [theme, setTheme] = useState("root")
    const [selectedModel, setSelectedModel] = useState("")
    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const values = {
        theme, setTheme,
        selectedModel, setSelectedModel,
        output, setOutput,
        loading, setLoading,
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

export const getStore = () => useContext(AppContext)
