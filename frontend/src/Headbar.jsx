import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './Headbar.module.css'
import { AiOutlineHome, AiOutlineGithub } from "react-icons/ai";


export default function Headbar() {
    return (
        <>
            <div className={styles.main}>
                <a href="https://snutig.de" target="_blank" title="Homepage" ><AiOutlineHome /></a>
                <a href="https://github.com/MPalamut/Ai.git" target="_blank" title="Github Repository" > <AiOutlineGithub /> </a>
                <button className={styles.anmelden}>Anmelden</button>
                {/* <a className ={styles.anmelden} href="#"  title="Anmelden">Anmelden</a> */}
            </div>
        </>
    )
}