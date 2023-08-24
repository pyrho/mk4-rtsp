import { exec } from 'node:child_process'
import ffmpegStatic from 'ffmpeg-static'

export function startRelay() {
  console.info(`[${+new Date()}] Starting relay...`)
  exec(
    `${ffmpegStatic} -rtsp_transport tcp -i ${process.env.RTSP_STREAM} -f mpegts -codec:v mpeg1video -s 960x540 -b:v 1500k -r 30 -bf 0 -codec:a mp2 -ar 44100 -ac 1 -b:a 128k ./output/out.ts`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`)
        return
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }

      console.log(`stdout:\n${stdout}`)
    },
  )
}
