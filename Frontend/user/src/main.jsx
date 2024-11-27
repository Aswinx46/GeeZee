import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1094055194099-v89imp0b9i8264a8t3j17jaofgeshifj.apps.googleusercontent.com">
    <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)
