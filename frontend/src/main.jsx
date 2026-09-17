import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppProvider } from './Store'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import DefaultDashboard from './pages/DefaultDashboard'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)

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

