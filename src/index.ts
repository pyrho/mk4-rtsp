import 'dotenv/config'
import { StatusData, getStatus } from './status.js'
import { capture } from './capture.js'
import { notify } from './notify.js'
import { mergeImages } from './merge-images.js'
// import { startRelay } from './relay.js'
import express from 'express';
import relay from 'rtsp-relay'

const ONE_SECOND = 1000
const TICK_RATE = 30 * ONE_SECOND
const SLEEP_TICK_RATE = ONE_SECOND * 60 * 5

let lastStatus: null | StatusData = null
async function main() {
  const thisStatus = await getStatus()
  const running = thisStatus.printer.state === 'PRINTING'
  const stateHasChanged = lastStatus?.printer.state !== thisStatus.printer.state

  if (running) {
    lastStatus = thisStatus
    console.info(
      `[${+new Date()}] Printing in progress... [progress:${
        thisStatus.job.progress
      }%,time_remaning:${(new Date(thisStatus.job.time_remaining * 1000).toISOString().substring(11, 11 + 8))}]`,
    )
    await capture(`${thisStatus.job.id}`)
    setTimeout(main, TICK_RATE)
  }

  if (!running && stateHasChanged && lastStatus !== null) {
    console.info(`[${+new Date()}] Print done! Notifying.`)
    notify()
    await mergeImages(`${lastStatus.job.id}`)
  }

  if (!running) {
    lastStatus = thisStatus
    setTimeout(main, SLEEP_TICK_RATE)
    console.info(`[${+new Date()}] Sleeping...`)
  }
}

// This is bad
// startRelay()
main()



const app = express();
const { proxy, scriptUrl } = relay(app)

// the endpoint our RTSP uses
// app.ws('/api/stream', handler);
app.ws('/api/stream', proxy({ transport: 'tcp',
  url: process.env.RTSP_STREAM,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
}));

// this is an example html page to view the stream
app.get('/', (_, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

app.listen(2000);
