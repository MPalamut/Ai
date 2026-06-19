import React from 'react'
import { AppProvider } from './Store'
import Input from './Input'
import Output from './Output'
import Sidebar from './Sidebar'
import Accessiblity from './Accessibility'

export default function App() {
  return (
    <AppProvider>
       <Input />
      <Sidebar />
      <Output />
      <Accessiblity />
    </AppProvider>
  )
}