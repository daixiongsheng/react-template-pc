import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.css'
import { HashRouter as Router } from 'react-router-dom'
import { ProvideAuth } from './hooks'

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
)
