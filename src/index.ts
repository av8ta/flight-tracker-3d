import Dump1090 from './callbag-dump1090.js'
import { WebSocketServer } from 'ws'
import observe from 'callbag-observe'
import Debug from 'debug'
// tslint:disable-next-line:no-console
const log = Debug('callbag-dump1090:ws')

const messages = Dump1090()
const PORT = Number.parseInt(process.env.websocket_port || '2222', 10)
const wsServer = new WebSocketServer({ port: PORT })

wsServer.on('connection', _socket => {
  log('WebSocket client connected')
  wsServer.clients.forEach(client => {
    observe((message: any) => client.send(JSON.stringify(message)))(messages)
  })
})

log((new Date()) + ' dump1090 ads-b WebSocket server is listening on port ' + PORT)
