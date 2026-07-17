import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppProvider } from './Store'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import DefaultDashboard from './pages/DefaultDashboard'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/defaultdashboard" element={<DefaultDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}