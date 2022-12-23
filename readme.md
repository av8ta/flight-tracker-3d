# flight-tracker-3d

Decodes ads-b packets received from a software defined radio such as the repurposed digital tv usb stick known as rtl-sdr and displays flight tracks.

Left pane shows the positions on a leaflet map. The right side shows a 3D rendered view from the pilot's perspective courtesy of cesiumjs.

![screenshot](./screenshot.png)

## Usage

Start dump1090 to capture data from the usb radio. Requires docker.

```shell
npm run adsb
```

If you already have dump1090 software running the app will connect to it on localhost:30002. If located elsewhere copy dotenv to .env and change the port and host as required.

```shell
websocket_port=<your port>
websocket_host=<your host>
```

Sign up and then acquire a cesium token here <https://cesium.com/ion/tokens>. Place the token in your .env file.

```shell
cesium_token=<your token>
```

Build the project.

```shell
npm install
npm run build
```

Serve.

```shell
# serve data over websocket
npm start
# serve webapp
npm run serve
```

# callbag-net

👜 A callbag source (client) for nodejs net.Socket

[callbag-net](https://www.npmjs.com/package/callbag-net) has been refactored out of this project and published to npm.

You might find it useful for streaming nodejs [`net.Socket`](https://nodejs.org/api/net.html#class-netsocket) tcp or ipc connections:

"This class is an abstraction of a TCP socket or a streaming IPC endpoint (uses named pipes on Windows, and Unix domain sockets otherwise)."
