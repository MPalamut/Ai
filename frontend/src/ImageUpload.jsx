import React, { useState, useRef, useCallback } from "react";
import styles from "./ImageUpload.module.css"
import { getStore } from "./Store.jsx";
import { AiOutlinePaperClip, AiOutlineClose } from "react-icons/ai";

export default function ImageUpload() {
    const fileInputRef = useRef();
    const { fileName, setFileName, setBase64String, setPreviousResponse } = getStore();

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) { setFileName(file.name); }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setBase64String(result);
        };
        reader.readAsDataURL(file);
    };
    const handleClearFile = () => {
        setFileName("");
        setBase64String("");
        setPreviousResponse("");
        fileInputRef.current.value = "";
    };
    
    return (
        <>
            <input className={styles.inputFile} ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
            {fileName ?
                <div className={styles.fileWrapper}>
                    <span className={styles.fileName}>{fileName}</span>
                    <button className={styles.clearButton} type="button" title="Bild entfernen" onClick={handleClearFile} >
                        <AiOutlineClose />
                    </button>
                </div>
                :
                <button
                    className={styles.uploadButton}
                    title="Bild hochladen"
                    onClick={openFileDialog}
                >
                    <AiOutlinePaperClip />
                </button>
            }

        </>
    )
}