import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './Modal.module.css'
import { AiOutlineHome, AiOutlineGithub } from "react-icons/ai";

export default function Modal({ isOpen, text }) {
if (!isOpen) return null;

    let contentText = ""

    switch (text) {
        case "dsgvo":
            contentText = "DSGVO"
            break
        case "hilfe":
            contentText = "Hilfe"
            break
    }

    return (
        <>
            <div className={styles.modal}>{contentText}</div>
        </>
    )
}