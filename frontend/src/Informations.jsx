import React from 'react'
import { useState, useEffect } from "react"

export default function Informations() {
    const [tokensDaily, setTokensDaily] = useState();
    const [tokensAll, setTokensAll] = useState();

    useEffect(() => {
        const fetchInformations = async () => {
            try {
                const url = "http://172.16.16.106:8000/getTokens"
                const res = await fetch(url, { method: "GET" })

                const data = await res.json()
                if (data.status === "success") {
                    setTokensDaily(data.tokensDaily);
                    setTokensAll(data.tokensAll);
                }

            } catch (error) { console.error(error) }
        };
        fetchInformations();

        const intervalId = setInterval(fetchInformations, 5000);
        return () => clearInterval(intervalId);
    }, []);

        const tokenprice = 0.000005
        const savedMoney = (tokensAll * tokenprice).toFixed(2)

    return (
        <>
            <span> TokenDaily {tokensDaily}</span>
            <span> TokenAll {tokensAll}</span>
            <span>Ersparnis {savedMoney} €</span>
        </>
    )
}