import { useState, useEffect, useRef } from "react";
import "./Output.css"
import { getStore } from "./Store.jsx";

export default function Output() {
    const { output } = getStore()
    const scrollRef = useRef()
    const { loading } = getStore()


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
                {output.map((item) => (<div> <pre>{item}</pre></div>))}
                {loading && <div className="preloader"><span></span><span></span><span></span></div>}
            </div>
        </>
    )
}