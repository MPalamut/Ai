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
                   if (!clickedInsideMenu && !clickedOnButton ) {
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
                <div className={styles.menu}>
                    <select className={styles.temperature} title="Denkweise" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}>
                        <option value="0.1">Schnelles Denken</option>
                        <option value="0.7">Präzises Denken</option>
                        <option value="1.9">Tiefgründiges Denken</option>
                    </select>
                    </div>

            </div>}

        </>
    )
}