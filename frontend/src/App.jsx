import React from 'react'
import { AppProvider } from './Store'
import Output from './Output'
import Sidebar from './Sidebar'
import Input from './Input'

export default function App() {
  return (
    <AppProvider>
      <Sidebar />
      <Output />
      <Input />
    </AppProvider>
  )
}
