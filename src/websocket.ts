import websocket from 'callbag-websocket'
import observe from 'callbag-observe'
import WebSocket from 'ws'
Object.assign(global, { WebSocket })

const HOST = process.env.websocket_host || 'localhost'
const PORT = Number.parseInt(process.env.websocket_port || '2222', 10)

let ws = websocket(`ws://${HOST}:${PORT}`)

observe((message: { data: any }) => console.log(message.data))(ws)
