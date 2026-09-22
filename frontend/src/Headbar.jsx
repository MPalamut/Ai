import { useState} from "react"
import { AiOutlineHome, AiOutlineGithub } from "react-icons/ai";
import Registration from './Registration';
import styles from './Headbar.module.css'

export default function Headbar() {
    const [showRegisterMenu, setShowRegisterMenu] = useState(false);
    const handleClick = () => {
    setShowRegisterMenu(true);
}
    return (
        <>
            <div className={styles.headbar}>
                <a href="https://snutig.de" target="_blank" title="Homepage" ><AiOutlineHome /></a>
                <a href="https://github.com/MPalamut/Ai.git" target="_blank" title="Github Repository" > <AiOutlineGithub /> </a>
                <button className={styles.anmelden} onClick={handleClick}>Anmelden</button>
            </div>
            {showRegisterMenu && (<Registration onClose={() => setShowRegisterMenu(false)} />)}
        </>
    )
}