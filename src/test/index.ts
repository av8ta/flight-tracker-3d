import { parseData } from '../callbag-dump1090.js' // tslint:disable-next-line:no-implicit-dependencies
import assert from 'node:assert'
import { pipe, fromIter, map } from 'callbag-basics-esmodules'
import last from 'callbag-last'
import subscribe from 'callbag-subscribe'
import { AdsbData } from '../types'

const expected = { "callsign": "", "lon": 3.9389, "lat": 52.2658, "altitude": 38000, "speed": 0, "heading": 0 }
const messages = ['*8D40621D58C382D690C8AC2863A7;', '*8D40621D58C386435CC412692AD6;']
const messages$ = fromIter(messages)

/**
 * the decoding function is impure as it uses timestamps for the calculation of latitude and longitude.
 * however the timestamps are not included in the raw data from ads-b so must be supplied by the receiver.
 * we fix the decimal places from 4 down to 1 when testing so that they ought to be the same when tests are run in future.
 */
pipe(
  messages$,
  map((str: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => Buffer.from(str)),
  map((chunk: Buffer) => parseData(chunk)),
  last(),
  subscribe({
    next: (result: AdsbData) => {
      assert(result, 'Result is truthy')
      assert(result.parsed?.callsign === expected.callsign)
      assert(result.parsed.lat.toFixed(1) === expected.lat.toFixed(1), 'Latitude value is correct')
      assert(result.parsed.lon.toFixed(1) === expected.lon.toFixed(1), 'Longitude value is correct')
      assert(result.parsed.altitude === expected.altitude, 'Altitude value is correct')
      assert(result.parsed.speed === expected.speed, 'Speed value is correct')
      assert(result.parsed.heading === expected.heading, 'Heading value is correct')
    },
    error: (error: unknown) => { throw new Error(`Error in test: ${error}`) }, // tslint:disable-next-line:no-console
    complete: () => console.log('Test Passed')
  })
)
