import Dump1090Source from 'callbag-adsb'
import { WebSocketServer } from 'ws'
import observe from 'callbag-observe'

const messages = Dump1090Source()
const PORT = Number.parseInt(process.env['websocket_port'] || '2222', 10)
const wsServer = new WebSocketServer({ port: PORT })

wsServer.on('connection', _socket => {
  console.log('WebSocket client connected')
  wsServer.clients.forEach(client => {
    observe(message => client.send(JSON.stringify(message)))(messages)
  })
})

console.log((new Date()) + ' dump1090 ads-b WebSocket server is listening on port ' + PORT)
