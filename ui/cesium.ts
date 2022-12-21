// @ts-ignore
window.CESIUM_BASE_URL = '/cesium' // The URL on your server where CesiumJS's static files are hosted.

import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import observe from 'callbag-observe'
import { AdsbData } from './types.js'
import { adsb$ } from './data.js'

if (!process.env.cesium_token) throw new Error('Place your cesium token in .env - an example file is named dotenv')
Cesium.Ion.defaultAccessToken = process.env.cesium_token

const viewer = new Cesium.Viewer('cesiumContainer', { terrainProvider: Cesium.createWorldTerrain() })
const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings())

const location: [number, number, number] = [115.278943, -8.580189, 10000]

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(...location),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-15.0),
  }
})

observe((message: { data: string }) => {
  const adsbData: AdsbData = JSON.parse(message.data)
  console.log(adsbData)
  if (adsbData.parsed) {
    const { callsign, lon, lat, altitude, speed, heading, timestamp } = adsbData.parsed

     viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, altitude * 0.3048),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(-15.0),
      }
    })
  }
})(adsb$)
