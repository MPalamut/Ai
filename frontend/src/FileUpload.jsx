import React from "react";
import { useState, useEffect, useRef } from "react"
import styles from "./FileUpload.module.css"
import { getStore } from "./Store.jsx";
import { AiOutlinePaperClip, AiOutlineFile, AiOutlineFileImage, AiOutlineClose } from "react-icons/ai";

export default function FileUpload() {
    const [menuopen, setMenuOpen] = useState(false)
    const menuOpenRef = useRef()
    const fileInputRef = useRef();
    const imageInputRef = useRef();
    const { setPreviousResponse, fileName, setFileName, fileBase64, setFileBase64, imageName, setImageName, imageBase64, setImageBase64 } = getStore();

    useEffect(() => {
        function clickOutside(e) {
            if (menuOpenRef.current) {
                const clickedInsideMenu = menuOpenRef.current.contains(e.target);
                const clickedOnButton = e.target.closest(`.${styles.uploadButton}`);
                if (!clickedInsideMenu && !clickedOnButton) {
                    setMenuOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => { setFileBase64(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => { 
        fileInputRef.current.click();
        setMenuOpen(false)
     };

    const handleImageChange = (event) => {
        const image = event.target.files[0];
        if (image) { setImageName(image.name); }
        const reader = new FileReader();
        reader.onloadend = () => { setImageBase64(reader.result); };
        reader.readAsDataURL(image);
    };

    const openImageDialog = () => { 
        imageInputRef.current.click();
        setMenuOpen(false)
    };

    const handleClear = () => {
        setPreviousResponse("");
        setFileName("");
        setFileBase64("");
        setImageName("");
        setImageBase64("");
        fileInputRef.current.value = "";
        imageInputRef.current.value = "";
    };

    return (
        <>
            <input className={styles.inputFile} ref={fileInputRef} type="file" accept=".pdf, .docx" onChange={handleFileChange} />
            <input className={styles.inputFile} ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} />

            {imageName || fileName ?
                <div className={styles.fileWrapper}>
                    <span >{imageName || fileName}</span>
                    <button className={styles.clearButton} type="button" title="Bild entfernen" onClick={handleClear} >
                        <AiOutlineClose />
                    </button>
                </div>
                :
                <>
                    <div className="wrapper">
                        <button className={styles.uploadButton} title="Datei hochladen"  onClick={() => { setMenuOpen(!menuopen) }}> <AiOutlinePaperClip /></button>
                        {menuopen && <div className={styles.menu} ref={menuOpenRef}>
                            <button className={styles.menuButton} title="Dokument hochladen" onClick={openFileDialog}><AiOutlineFile /> Dokumenten hochladen</button>
                            <button className={styles.menuButton} title="Bild hochladen" onClick={openImageDialog}> <AiOutlineFileImage /> Bild hochladen </button>
                        </div>}
                    </div>

                </>
            }
        </>
    )
}