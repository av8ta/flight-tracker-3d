# flight-tracker-3d

Decodes ads-b packets recived from a software defined radio such as the repurposed digital tv usb stick known as rtl-sdr and displays flight tracks.

Left pane shows the positions on a leaflet map. The right side shows a 3D rendered view courtesy of cesiumjs.

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

Sign up and then acquire a cesium token here https://cesium.com/ion/tokens. Place the token in your .env file.

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
npm run serve
```
