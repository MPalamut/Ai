import React from 'react'
import { useState, useEffect } from "react"
import styles from "./InformationModal.module.css"

export default function InformationModal({ text, onClose }) {

    return (
        <>
            <div className={styles.bg} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <button className={styles.close}onClick={onClose}>X</button>
                    </div>
                    <div className={styles.content}>{text} </div>
                </div>
            </div>
        </>
    )
}