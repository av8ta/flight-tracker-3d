import net from 'node:net'
import makeSubject from 'callbag-subject'
import decoder from 'decoder1090-c'
import Debug from 'debug'
import { Signal } from './types.js'

const log = Debug('callbag-dump1090')

const PORT = Number.parseInt(process.env.dump1090_port || '30002', 10)
const HOST = process.env.dump1090_host || 'localhost'
const defaultRetries = -1 // retry forever

const client = new net.Socket()

export interface Options {
  port?: number,
  host?: string,
  retries?: number
}

export default function ({ port = PORT, host = HOST, retries = defaultRetries }: Options = {}) {
  const messages = makeSubject()

  client.connect(port, host)

  client.on('connect', (error: any) => {
    if (error) console.error(error)
    else log('connected!')
  })

  client.on('data', chunk => {
    const lines = chunk.toString('utf8').split('\n').filter(line => line.length > 0)
    for (let message of lines) {
      log(message)
      const decoded: string = decoder.decodeMsg(message)
      if (decoded.length > 0) {
        const parsed = parseDecoded(decoded)
        if (parsed) messages(Signal.DATA, { message, decoded, parsed })
        else messages(Signal.DATA, { message, decoded })
      }
      else messages(Signal.DATA, { message })
    }
  })

  client.on('end', () => {
    tryReconnect(port, host, retries, () => {
      log('data end')
      messages(Signal.END)
      client.destroy()
    })
  })

  client.on('error', error => {
    console.error(error)

    tryReconnect(port, host, retries, () => {
      log(error)
      messages(Signal.END, error)
    })
  })

  client.on('close', () => {
    tryReconnect(port, host, retries, () => {
      log('closing connection')
      messages(Signal.END)
      client.destroy()
    })

  })

  return messages
}

function parseDecoded(data = '') {
  // "!callsign, lon, lat, altitude, speed, heading, timestamp*"
  if (data[0] === '!' && data[data.length - 1] === '*') {
    const [callsign, lon, lat, altitude, speed, heading, timestamp] = data.split(',')
    return {
      callsign: callsign.slice(1).trim(),
      lon: Number.parseFloat(lon),
      lat: Number.parseFloat(lat),
      altitude: Number.parseFloat(altitude),
      speed: Number.parseFloat(speed),
      heading: Number.parseFloat(heading),
      timestamp: Number.parseFloat(timestamp.split('*')[0])
    }
  }
  return null
}

var attempts = 0
var finished = false
var timeout: NodeJS.Timeout | undefined

function tryReconnect(port: number, host: string, retries: number, callback: () => void) {
  if (retries === -1) finished = false
  if (!finished) {
    log('attempting reconnection')
    reconnect(port, host, retries)
  }
  else {
    if (callback) callback()
    client.destroy()
  }
}

function reconnect(port: number, host: string, retries: number) {
  clearTimeout(timeout)

  timeout = setTimeout(() => client.connect(port, host, () => (attempts = 0)), 1000)
  attempts++
  if (attempts >= retries && retries !== -1) {
    client.destroy()
    finished = true
  }
}
