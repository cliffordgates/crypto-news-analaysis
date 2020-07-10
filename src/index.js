import React from 'react'
import ReactDOM from 'react-dom'
import WebFont from 'webfontloader'

import App from './App'

WebFont.load({
  google: {
    families: ['Ubuntu|Material+Icons', 'sans-serif'],
  },
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
