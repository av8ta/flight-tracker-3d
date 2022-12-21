import { Client } from 'callbag-net'
import type { Options } from 'callbag-net'
import { pipe, map } from 'callbag-basics-esmodules'
import { SocketConnectOpts } from 'node:net'
import { AdsbData } from './types.js'
import decoder from 'decoder1090-c'
import Debug from 'debug'

const log = Debug('callbag-dump1090')

const defaultRetries = -1 // retry forever
const defaultSocketOptions = {
  port: Number.parseInt(process.env.dump1090_port || '30002', 10),
  host: process.env.dump1090_host || 'localhost'
}
const callbagNetOptions: Options = { retries: defaultRetries, reconnectOnEnd: true }

export default function (socketOptions: SocketConnectOpts = defaultSocketOptions, options: Options = callbagNetOptions) {
  const messages = pipe(
    Client(socketOptions, options),
    map((chunk: Buffer) => parseData(chunk))
  )
  return messages
}

export function parseData(chunk: Buffer): AdsbData | null {
  const lines = chunk.toString('utf8').split(';').filter(line => line.length > 0)
  for (let msg of lines) {
    const message = `${msg};`
    log(message)
    const decoded: string = decoder.decodeMsg(message)
    if (decoded.length > 0) {
      const parsed = parseDecoded(decoded)
      if (parsed) return { message, decoded, parsed }
      else return { message, decoded }
    }
    else return { message }
  }
  return null
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
