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

    const toggleTheme = () => {
        setTheme(prev => prev == "root" ? "light" : "root")
    }

    const addOutput = (text) => {
        setOutput(prevOutput => [...prevOutput, text])
    }

    const values = {
        theme, toggleTheme,
        selectedModel, setSelectedModel,
        output, setOutput, addOutput,
        loading, setLoading
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

export const getStore = () => useContext(AppContext)