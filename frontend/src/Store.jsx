import React from 'react'
import { createContext, useContext, useState, useEffect } from "react";
const AppContext = createContext();

export function AppProvider({ children }) {
    const [theme, setTheme] = useState("root")
    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [imageName, setImageName] = useState("")
    const [fileBase64String, setFileBase64String] = useState("")
    const [imageBase64String, setimageBase64String] = useState("")
    const [previousResponse, setPreviousResponse] = useState("")

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const values = {
        theme, setTheme,
        output, setOutput,
        loading, setLoading,
        fileName, setFileName,
        imageName, setImageName,
        fileBase64String, setFileBase64String,
        imageBase64String, setimageBase64String,
        previousResponse, setPreviousResponse
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

export const getStore = () => useContext(AppContext)