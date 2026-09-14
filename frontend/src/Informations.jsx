import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from "./Informations.module.css"

export default function Informations({ onClose }) {
    const [promptsDaily, setPromptsDaily] = useState()
    const [tokensDaily, setTokensDaily] = useState();
    const [visits, setVisits] = useState();
    const [promptsAll, setPromptsAll] = useState()
  
    const [tokensAll, setTokensAll] = useState();
    const [oldestDate, setOldestDate] = useState("");
    const [usersCount, setUsersCount] = useState()
    const menuRef = useRef()

    useEffect(() => {
        const fetchInformations = async () => {
            try {
                const url = "http://10.10.70.105:8000/infos"
                const res = await fetch(url, { method: "GET" })
                const data = await res.json()
                if (data.status === "success") {
                    setPromptsDaily(data.promptsDaily)
                    setTokensDaily(data.tokensDaily);
                    setVisits(data.visits);
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

    return (
        <>
            <div className={styles.menu} ref={menuRef} >

                <div className={styles.info}>
                    <span>Heutige Statistik</span><br />
                    <div><span>Prompts</span> <span>{promptsDaily}</span></div>
                    <div ><span>Tokenverbrauch</span> <span>{tokensDaily}</span></div>
                    <div ><span>Einzigartige Besucher</span> <span>{visits}</span></div>
            </div>
           </div>
        </>
    )
}