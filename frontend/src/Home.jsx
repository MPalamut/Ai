import React from 'react'
import { useState, useEffect, useRef } from "react"

export default function Home() {

    useEffect(() => {
        const getHome = async () => {
            try {
                await fetch('http://172.16.16.106:8000/');

            } catch (error) {
                console.error('Fehler beim Aufruf der API:', error);
            }
        };
        getHome();
    }, []);
}


