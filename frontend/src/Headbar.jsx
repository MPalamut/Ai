import React, { use } from 'react'
import { useState} from "react"
import styles from './Headbar.module.css'
import { AiOutlineHome, AiOutlineGithub } from "react-icons/ai";
import Register from './Register';
import InformationModal from './InformationModal';
import { getStore } from "./Store";

export default function Headbar() {
    const [showRegisterMenu, setShowRegisterMenu] = useState(false);
    const [informationModalText, setInformationModalText] = useState("")
    const { username, setUsername } = getStore();

    const handleClick = () => {
  if (username) {
    setUsername("");
    setInformationModalText("Erfolgreich abgemeldet")

  } else {
    setShowRegisterMenu(!showRegisterMenu);
  }
}
    return (
        <>
            <div className={styles.headbar}>
                <a href="https://snutig.de" target="_blank" title="Homepage" ><AiOutlineHome /></a>
                <a href="https://github.com/MPalamut/Ai.git" target="_blank" title="Github Repository" > <AiOutlineGithub /> </a>
                <button className={styles.anmelden} onClick={handleClick}> {username ? (<>
                    <span>{username}</span>
                    <span>Abmelden</span>
                    </>): (
                    "Anmelden"
                )} </button>
            </div>
            {showRegisterMenu && (<Register onClose={() => setShowRegisterMenu(false)} />)}
            {informationModalText && <InformationModal text={informationModalText} onClose={() => setInformationModalText("")} />}
        </>
    )
}