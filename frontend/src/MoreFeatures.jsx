import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './MoreFeatures.module.css'
import { AiOutlineBars } from "react-icons/ai";
import { getStore } from "./Store.jsx"

export default function Headbar() {
    const [menuopen, setMenuOpen] = useState(false)
    const menuOpenRef = useRef()
    const { temperature, setTemperature } = getStore();

    useEffect(() => {
        function clickOutside(e) {
            if (menuOpenRef.current) {
                const clickedInsideMenu = menuOpenRef.current.contains(e.target);
                const clickedOnButton = e.target.closest(`.${styles.moreFeatures}`);
                if (!clickedInsideMenu && !clickedOnButton) {
                    setMenuOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [])

    return (
        <>
            <button className={styles.moreFeatures} title="Mehr Funktionen" onClick={() => { setMenuOpen(!menuopen) }}> <AiOutlineBars /></button>

            {menuopen && <div className={styles.menu} ref={menuOpenRef}>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="temperature"
                            value="0.1"
                            checked={temperature === 0.1}
                            onChange={() => setTemperature(0.1)}
                        />
                        Schnelles Denken
                    </label>

                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="temperature"
                            value="0.7"
                            checked={temperature === 0.7}
                            onChange={() => setTemperature(0.7)}
                        />
                        Präzises Denken
                    </label>

                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="temperature"
                            value="1.9"
                            checked={temperature === 1.9}
                            onChange={() => setTemperature(1.9)}
                        />
                        Tiefgründiges Denken
                    </label>
                </div>
            </div>
            }
        </>
    )
}