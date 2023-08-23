import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { access, constants, mkdir } from 'fs/promises'

export async function capture(jobDir: string): Promise<null> {
  const path = `./output/${jobDir}`
  try {
    await access(path, constants.W_OK)
  } catch (_e) {
    await mkdir(path)
  }
  return new Promise((resolve, reject) => {
    // Tell fluent-ffmpeg where it can find FFmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic)

    // Run FFmpeg
    ffmpeg()
      // Input file
      .input(process.env.RTSP_STREAM)

      // ffmpeg -rtsp_transport tcp -i rtsp://10.25.1.1:7447/yQl88kMNLTF6RwpS
      // -frames:v 1 -y test.png
      .inputOptions('-rtsp_transport', 'tcp')
      .inputOptions('-ss', '00:00:01.50')

      .outputOptions('-frames:v', '1')

      // Output file
      .saveToFile(`${path}/${+new Date()}.jpg`)
      // .saveToFile(`./output/${outputDir}/${+new Date()}.jpg`)

      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        console.log('FFmpeg has finished.')
        return resolve(null)
      })

      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        return reject(error)
      })
  })
}
