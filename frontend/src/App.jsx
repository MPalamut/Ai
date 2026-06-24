import React from 'react'
import { AppProvider } from './Store'
import Headbar from './Headbar'
import Modal from './Modal'
import Input from './Input'
import Output from './Output'
import Sidebar from './Sidebar'
import Accessiblity from './Accessibility'

export default function App() {
  return (
    <AppProvider>
      <Headbar />
       <Input />
      <Sidebar />
      <Output />
      <Accessiblity />
    </AppProvider>
  )
}