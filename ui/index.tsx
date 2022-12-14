import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import websocket from 'callbag-websocket'
import observe from 'callbag-observe'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const HOST = process.env.websocket_host || 'localhost'
const PORT = Number.parseInt(process.env.websocket_port || '2222', 10)

let ws = websocket(`ws://${HOST}:${PORT}`)

observe((message: { data: any }) => console.log(message.data))(ws)
