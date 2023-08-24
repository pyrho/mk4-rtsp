import ffmpeg from 'fluent-ffmpeg'
import { opendir } from 'node:fs/promises'
import ffmpegStatic from 'ffmpeg-static'

async function getFirstFileInDir(jobDir: string): Promise<string> {
  try {
    const dir = await opendir(`./output/${jobDir}`)
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        return dirent.path
      }
    }
  } catch (err) {
    console.error(err)
  }
}

export async function mergeImages(jobDir: string): Promise<null> {
  console.info(`[${+new Date()}] Creating timelapse...`)
  // We need this hack so that we can provide the `-pattern_type` input argument
  const firstFile = await getFirstFileInDir(jobDir)
  return new Promise((resolve, reject) => {
    // Tell fluent-ffmpeg where it can find FFmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic)

    // Run FFmpeg
    ffmpeg(firstFile)
      // Input file
      .inputOptions('-pattern_type', 'glob')
      .inputOptions('-i', `./output/${jobDir}/*.jpg`)

      // Output file
      .saveToFile(`./output/${jobDir}/timelapse.mp4`)
      // .saveToFile(`./output/${outputDir}/${+new Date()}.jpg`)

      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        console.info(`[${+new Date()}] Timelapse created!`)
        return resolve(null)
      })

      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        return reject(error)
      })
  })
}
