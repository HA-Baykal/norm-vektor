import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import BlogPage from "./pages/BlogPage";
import BlogArticle from "./pages/BlogArticle";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)