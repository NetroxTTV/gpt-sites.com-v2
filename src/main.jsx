import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const storedTheme = localStorage.getItem('theme')
const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'
document.documentElement.classList.toggle('dark', initialTheme === 'dark')
document.documentElement.style.colorScheme = initialTheme

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
