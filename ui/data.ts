import websocket from 'callbag-websocket'

const HOST = process.env.websocket_host || 'localhost'
const PORT = Number.parseInt(process.env.websocket_port || '2222', 10)
export const adsb$ = websocket(`ws://${HOST}:${PORT}`)
