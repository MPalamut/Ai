import React from 'react'
import { useEffect, useRef } from "react";
import styles from "./Output.module.css"
import { getStore } from "./Store.jsx";

export default function Output() {
    const { output , loading } = getStore()
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
                {output.length === 0 && <h2 className={styles.greeting}>Hi, ich bin dein loaker Ai Agent</h2>}
                {output.map((item,index) => (
                    <div key={index}>
                     <pre>{item.text}
                        {item.tokens && <p className={styles.tokens}>Verbrauchte Tokens: {item.tokens}</p>}
                     </pre>
                      </div>
                    ))}
                {loading && <div className={styles.preloader}><span></span><span></span><span></span></div>}
            </div>
        </>
    )
}