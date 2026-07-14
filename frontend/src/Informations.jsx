import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Informations.module.css"

export default function Informations({ onClose }) {
    const [tokensDaily, setTokensDaily] = useState();
    const [tokensAll, setTokensAll] = useState();
    const [oldestDate, setOldestDate] = useState("");
    const menuRef = useRef()

    useEffect(() => {
        const fetchInformations = async () => {
            try {
                const url = "http://172.16.16.106:8000/getTokens"
                const res = await fetch(url, { method: "GET" })
                const data = await res.json()
                if (data.status === "success") {
                    setTokensDaily(data.tokensDaily);
                    setTokensAll(data.tokensAll);
                    setOldestDate(data.oldestDate)
                }

            } catch (error) { console.error(error) }
        };
        fetchInformations();

        const intervalId = setInterval(fetchInformations, 5000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedOnInfoButton = event.target.closest('[title="Infos"]');
            if (menuRef.current && !menuRef.current.contains(event.target) && !clickedOnInfoButton) { onClose();}
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
                <div> <span> Tokens Heute </span> <span>{tokensDaily}</span></div>
                <div><span>Ersparnis Heute</span> <span>{savedMoneyToday} €</span></div>
                <div><span>Tokens Gesamt seit {displayDate}</span> <span>{tokensAll}</span></div>
                <div><span>Ersparnis Gesamt seit {displayDate}</span> <span>{savedMoneyAll} €</span></div>
                <span className={styles.small}>*Ersparnis gegenüber gängigen KI Sprachmodellen bei  5 € / 1 Mio Token</span>
            </div>

        </>
    )
}