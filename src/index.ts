import 'dotenv/config'
import { StatusData, getStatus } from './status.js'
import { capture } from './capture.js'
import { notify } from './notify.js'

const TICK_RATE = 1000 * 60
// const LAYER_HEIGHT = 0.2

let lastStatus: null | StatusData = null
async function main() {
  const thisStatus = await getStatus()
  const running = thisStatus.printer.state === 'PRINTING'
  console.dir(thisStatus.printer)
  console.log('===')

  // const doCapture_layerHeight = lastStatus === null || (thisStatus.printer.axis_z - lastStatus.printer.axis_z) >= LAYER_HEIGHT

  const doCapture = true
  if (doCapture) await capture(`${thisStatus.job.id}`)
  
  lastStatus = thisStatus

  if (running) setTimeout(main, TICK_RATE)
  else notify()
}

main()
