import React from 'react'
import { useState, useEffect, useRef } from "react"
import styles from './Headbar.module.css'
import { AiFillGithub } from "react-icons/ai";


export default function Headbar() {
    return (
        <>
            <div className={styles.main}>
                <a href="https://github.com/MPalamut/Ai.git" target="_blank" title ="Github Repository" >
                    <AiFillGithub />
                </a>
            </div>
        </>
    )
}