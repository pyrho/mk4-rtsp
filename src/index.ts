import 'dotenv/config'
import { StatusData, getStatus } from './status.js'
import { capture } from './capture.js'
import { notify } from './notify.js'
import { mergeImages } from './merge-images.js'

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
      }%,time_remaning:${(thisStatus.job.time_remaining / 60 / 60).toFixed(2)}]`,
    )
    await capture(`${thisStatus.job.id}`)
    setTimeout(main, TICK_RATE)
  }

  if (!running && stateHasChanged) {
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

main()
