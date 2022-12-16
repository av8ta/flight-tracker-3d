import './index.css'
import 'leaflet/dist/leaflet.css'
import L, { LatLngTuple } from 'leaflet'
import observe from 'callbag-observe'
import { AdsbData } from './types'
import { adsb$ } from './data.js'

const location: LatLngTuple = [-8.580189, 115.278943]

const map = L.map('map').setView(location, 10)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

observe((message: { data: string }) => {
  const adsbData: AdsbData = JSON.parse(message.data)
  console.log(adsbData)
  if (adsbData.parsed) {
    const { callsign, lon, lat, altitude, speed, heading, timestamp } = adsbData.parsed
    const position: LatLngTuple = [lat, lon]
    const circle = L.circle(position, {
      color: 'blue',
      fillColor: 'aqua',
      fillOpacity: 0.5,
      radius: 400
    }).addTo(map)
    circle.bindPopup(`<b>${callsign ? `${callsign} at ` : ''} ${altitude} feet bearing ${heading}° at ${speed} knots</b></br><p>${Date(timestamp)}</p>`)
  }
})(adsb$)
