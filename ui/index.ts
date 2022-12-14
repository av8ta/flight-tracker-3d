import './index.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import websocket from 'callbag-websocket'
import observe from 'callbag-observe'

const HOST = process.env.websocket_host || 'localhost'
const PORT = Number.parseInt(process.env.websocket_port || '2222', 10)
const adsb$ = websocket(`ws://${HOST}:${PORT}`)

const location = [-8.580189, 115.278943]

const map = L.map('map').setView(location, 10)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

const marker = L.marker(location).addTo(map)
marker.bindPopup("<b>Hello world!</b><br>I am a popup.")

observe((message: { data: any }) => {
  const adsbData = JSON.parse(message.data)
  console.log(adsbData)
  if (adsbData.parsed) {
    const { callsign, lon, lat, altitude, speed, heading, timestamp } = adsbData.parsed
    // const position = [Number.parseFloat(lat), Number.parseFloat(lon)]
    const position = [lat, lon]
    // console.log(position, lon, lat)
    const marker = L.marker(position).addTo(map)
    marker.bindPopup(`<b>${callsign ? `${callsign} at ` : ''} ${altitude} feet bearing ${heading}° at ${speed} knots</b></br><p>${Date(timestamp)}</p>`)
  }
})(adsb$)
