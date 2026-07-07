import React from 'react'
import { useState} from "react"
import styles from './Headbar.module.css'
import { AiOutlineHome, AiOutlineGithub } from "react-icons/ai";
import Register from './Register';
import { getStore } from "./Store";

export default function Headbar() {
    const [showRegisterMenu, setShowRegisterMenu] = useState(false);
    const { username } = getStore();

    return (
        <>
            <div className={styles.headbar}>
                <a href="https://snutig.de" target="_blank" title="Homepage" ><AiOutlineHome /></a>
                <a href="https://github.com/MPalamut/Ai.git" target="_blank" title="Github Repository" > <AiOutlineGithub /> </a>
                <button className={styles.anmelden} onClick={() => setShowRegisterMenu(!showRegisterMenu)}>{username ? username: "Anmelden"}</button>
            </div>
            {showRegisterMenu && (<Register onClose={() => setShowRegisterMenu(false)} />)}
        </>
    )
}