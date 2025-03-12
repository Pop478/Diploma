import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { init, backButton, initData } from '@telegram-apps/sdk-react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

init()
backButton.mount()
initData.restore()

createRoot(document.getElementById('root')).render(
    <StrictMode acceptCustomStyles debug>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
)
