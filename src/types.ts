export enum Signal {
  START = 0,
  DATA = 1,
  END = 2
}

export interface AdsbData {
  message: string,
  decoded?: string,
  parsed?: Position
}

export interface Position {
  callsign: string,
  lon: number,
  lat: number,
  altitude: number,
  speed: number,
  heading: number,
  timestamp: number
}
