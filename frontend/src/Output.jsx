import React, { useState } from 'react'
import { useEffect, useRef } from "react";
import styles from "./Output.module.css"
import { getStore } from "./Store.jsx";

export default function Output() {
    const { output , loading , fontSize, generation, completeTokens} = getStore()
    const scrollRef = useRef()

    useEffect(() => {
        if (scrollRef.current) {
            const lastDiv = scrollRef.current.querySelector("div:last-child");
            if (lastDiv) {
                lastDiv.scrollIntoView()
            }
        }
    }, [output]);
    
    return (
        <>
            <div className={styles.output} ref={scrollRef}>
                {output.length === 0 && 
                <div className={styles.greeting}>
                     <h1 className={styles.greetingTitle}>SNUTY</h1>
                <span className = {styles.greetingSpan}>DEINE LOKALE KI</span>
                </div>
                }
             
                {output.map((item,index) => (
                    <div  className= {index == output.length - 1 && index % 2 != 0 ? styles.lastMessage : ""} style={{ fontSize: `${fontSize}rem` }} key={index}>
                     <pre> {item.text } {item.tokens && <p className={styles.tokens}>Verbrauchte Tokens: {item.tokens} {index == output.length -1 && (
                        <span>{"/"} Generation: {generation} {"/"} Gesamttoken: {completeTokens}</span>
                     )}  </p>}
                     </pre>
                      </div>
                    ))}
                {loading && <div className={styles.preloader}><span></span><span></span><span></span></div>}
            </div>
        </>
    )
}