import { useState, useEffect, useRef } from "react";
import "./Output.css"
import { getStore } from "./Store.jsx";

export default function Output() {
    const { output } = getStore()
    const scrollRef = useRef()
    const { loading } = getStore()
    const {tokensUsed} = getStore()


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
            <div className="output" ref={scrollRef}>
                {output.length == 0 && <h2 className="greeting">Hi, ich bin dein loaker Ai Agent</h2>}
                {output.map((item,index) => (<div key={index}> <pre>{item}{(tokensUsed && index % 2 === 1) && ( <p className="tokens">Verbrauchte Tokens: {tokensUsed}</p>)}</pre></div>))}
                {loading && <div className="preloader"><span></span><span></span><span></span></div>}
            </div>
        </>
    )
}