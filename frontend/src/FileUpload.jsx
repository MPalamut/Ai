import React, { useState, useRef, useCallback } from "react";
import styles from "./FileUpload.module.css"
import { getStore } from "./Store.jsx";
import { AiOutlineFile, AiOutlineFileImage, AiOutlineClose } from "react-icons/ai";

export default function FileUpload() {
    const fileInputRef = useRef();
    const imageInputRef = useRef();
    const { setPreviousResponse, fileName, setFileName, setFileBase64String, imageName, setImageName, setimageBase64String } = getStore();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileBase64String(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => { fileInputRef.current.click(); };

    const handleImageChange = (event) => {
        const image = event.target.files[0];
        if (image) { setImageName(image.name); }
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setimageBase64String(result);
        };
        reader.readAsDataURL(image);
    };

    const openImageDialog = () => { imageInputRef.current.click(); };

    const handleClear = () => {
        setPreviousResponse("");
        setFileName("");
        setFileBase64String("");
        setImageName("");
        setimageBase64String("");
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
                    <button className={styles.uploadButton} title="Dokument hochladen" onClick={openFileDialog}> <AiOutlineFile /></button>
                    <button className={styles.uploadButton} title="Bild hochladen" onClick={openImageDialog}> <AiOutlineFileImage /></button>
                </>
            }
        </>
    )
}