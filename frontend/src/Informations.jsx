import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Informations.module.css"

export default function Informations({ onClose }) {
    const [promptsDaily, setPromptsDaily] = useState()
    const [promptsAll, setPromptsAll] = useState()
    const [tokensDaily, setTokensDaily] = useState();
    const [tokensAll, setTokensAll] = useState();
    const [oldestDate, setOldestDate] = useState("");
    const [usersCount, setUsersCount] = useState()
    const menuRef = useRef()

    useEffect(() => {
        const fetchInformations = async () => {
            try {
                console.log("INFOS")
                const url = "http://172.16.16.106:8000/infos"
                const res = await fetch(url, { method: "GET" })
                const data = await res.json()
                if (data.status === "success") {
                    setPromptsDaily(data.promptsDaily)
                    setPromptsAll(data.promptsAll)
                    setTokensDaily(data.tokensDaily);
                    setTokensAll(data.tokensAll);
                    setOldestDate(data.oldestDate)
                    setUsersCount(data.usersCount)
                }

            } catch (error) { console.error(error) }
        };
        fetchInformations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedOnInfoButton = event.target.closest('[id="stats"]');
            if (menuRef.current && !menuRef.current.contains(event.target) && !clickedOnInfoButton) { onClose(); }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const formatDateGerman = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("de-DE");
    };

    const displayDate = formatDateGerman(oldestDate)
    const tokenprice = 0.000005
    const savedMoneyToday = (tokensDaily * tokenprice).toFixed(2)
    const savedMoneyAll = (tokensAll * tokenprice).toFixed(2)

    return (
        <>
            <div className={styles.menu} ref={menuRef} >

                <div className={styles.prompts}>
                    <div><span>Prompts heute </span> <span>{promptsDaily}</span></div>
                    <div><span>Prompts seit {displayDate} </span> <span>{promptsAll}</span></div>
                </div>

                <div className={styles.tokens}>
                    <div ><span>Tokenverbrauch heute </span> <span>{tokensDaily}</span></div>
                    <div><span>Ersparnis heute</span> <span>{savedMoneyToday} €</span></div>
                    <div><span>Tokenverbrauch gesamt seit {displayDate}</span> <span>{tokensAll}</span></div>
                    <div><span>Ersparnis gesamt seit {displayDate}</span> <span>{savedMoneyAll} €</span></div>
                    <span className={styles.small}>*Ersparnis gegenüber gängigen KI Sprachmodellen bei  5 € / 1 Mio Token</span>
                </div>

                <div className={styles.registered}><span>Registrierte Benutzer</span><span>{usersCount}</span></div>
                
            </div>

        </>
    )
}