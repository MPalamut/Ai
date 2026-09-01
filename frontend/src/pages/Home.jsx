import React from 'react'
import { useEffect } from "react"
import Headbar from '../Headbar'
import Input from '../Input'
import Output from '../Output'
import Sidebar from '../Sidebar'
import Accessiblity from '../Accessibility'

export default function Home() {
    useEffect(() => {
        const getHome = async () => {
            try {
                await fetch('http://10.10.70.105:8000/');
            } catch (error) {
                console.error('Fehler beim Aufruf der API:', error);
            }
        };
        getHome();
    }, []);

    return (
        <>
            <Headbar />
            <Input />
            <Sidebar />
            <Output />
            <Accessiblity />
        </>
    )
}