import React from 'react'
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import styles from "../AdminDashboard.module.css"
import { getStore } from "../Store";

export default function AdminDashboard(){
    const {username} = getStore()
    const navigate = useNavigate();
    
 useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    return (
        <>
        <h2>Hi admin {username}</h2>
        </>
    )
}