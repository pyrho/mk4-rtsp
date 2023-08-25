import 'dotenv/config'
import { StatusData, getStatus } from './status.js'
import { capture } from './capture.js'
import { notify } from './notify.js'
import { deleteImages, mergeImages } from './merge-images.js'
import express from 'express'
import relay from 'rtsp-relay'
import { log } from './utils.js'
import expressWs from 'express-ws'

const ONE_SECOND = 1000
const TICK_RATE = 30 * ONE_SECOND
const SLEEP_TICK_RATE = ONE_SECOND * 60 * 5

let lastStatus: null | StatusData = null
async function main() {
  const thisStatus = await getStatus()
  const running = thisStatus !== null && thisStatus.printer.state === 'PRINTING'
  const stateHasChanged =
    thisStatus !== null &&
    lastStatus !== null &&
    lastStatus.printer.state !== thisStatus.printer.state

  if (running) {
    lastStatus = thisStatus
    log(
      `Printing in progress... [progress:${thisStatus.job.progress}%,time_remaning:${new Date(
        thisStatus.job.time_remaining * 1000,
      )
        .toISOString()
        .substring(11, 11 + 8)}]`,
    )
    await capture(`${thisStatus.job.id}`)
    setTimeout(main, TICK_RATE)
  }

  if (thisStatus !== null && !running && stateHasChanged && lastStatus !== null) {
    log('Print done! Notifying.')
    notify()
    await mergeImages(`${lastStatus.job.id}`)
    await deleteImages(`${lastStatus.job.id}`)
  }

  if (!running) {
    lastStatus = thisStatus
    setTimeout(main, SLEEP_TICK_RATE)
    log('Sleeping...')
  }
}

function startWebServer() {
  const wsApp = expressWs(express())
  const app = wsApp.app
  const { proxy, scriptUrl } = relay(app)

  app.ws(
    '/api/stream',
    proxy({
      transport: 'tcp',
      url: process.env.RTSP_STREAM,
      verbose: false,
    }),
  )

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
  )

  app.listen(2000)
}

main()
startWebServer()
