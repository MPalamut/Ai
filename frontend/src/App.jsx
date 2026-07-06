import React from 'react'
import { AppProvider } from './Store'
import Home from './Home'
import Headbar from './Headbar'
import Input from './Input'
import Output from './Output'
import Sidebar from './Sidebar'
import Accessiblity from './Accessibility'

export default function App() {
  return (
    <AppProvider>
      <Home />
      <Headbar />
       <Input />
      <Sidebar />
      <Output />
      <Accessiblity />
    </AppProvider>
  )
}