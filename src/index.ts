import Dump1090Source from 'callbag-adsb'
import { WebSocketServer } from 'ws'
import observe from 'callbag-observe'
import Debug from 'debug'
const log = Debug('callbag-dump1090:ws')

const messages = Dump1090Source()
const PORT = Number.parseInt(process.env['websocket_port'] || '2222', 10)
const wsServer = new WebSocketServer({ port: PORT })

wsServer.on('connection', _socket => {
  log('WebSocket client connected')
  wsServer.clients.forEach(client => {
    observe((message: any) => client.send(JSON.stringify(message)))(messages)
  })
})

log((new Date()) + ' dump1090 ads-b WebSocket server is listening on port ' + PORT)
