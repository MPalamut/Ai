import React from "react";
import { useState, useEffect, useRef } from "react"
import { getStore } from "./Store";

export default function Rag() {
const {rag, setRag} = getStore();

    return (
        <>
            <input type="checkbox" id="rag" name="rag" checked={rag} onChange={(e) => setRag(e.target.checked)} />
            <label htmlFor="rag">rag</label>
        </>
    )
}