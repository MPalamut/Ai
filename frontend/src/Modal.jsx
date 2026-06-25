import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './Modal.module.css'
import { AiOutlineClose } from "react-icons/ai";

export default function Modal({ text, onClose }) {
    const modalOpenref = useRef();

    const contents = {
        dsgvo: { title: "Datenschutz", content: "DSGVO" },
        hilfe: { title: "Hilfe", content: "Hilfe" },
        feedback: { title: "Feedback", content: "Feedback" }
    }

    useEffect(() => {
        function clickOutside(e) {
            if (modalOpenref.current) {
                const clickedInsideMenu = modalOpenref.current.contains(e.target);
                if (!clickedInsideMenu) {
                   onClose()
                }
            }
        }

        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [onClose])
    
          
    return (
        <>
            <div className={styles.modal} ref={modalOpenref}>
                <div className={styles.header}>
                    <div className={styles.title}>{contents[text].title}</div>
                    <div className={styles.close}><button onClick={() => onClose()}><AiOutlineClose/></button></div>
                </div>
                <div className={styles.content}>{contents[text].content}</div>
            </div>
        </>
    )
}