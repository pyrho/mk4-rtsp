import ffmpeg from 'fluent-ffmpeg'
import { opendir, readdir, unlink } from 'node:fs/promises'
import ffmpegStatic from 'ffmpeg-static'
import { log, tap } from './utils.js'

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
  log('Creating timelapse...')
  // We need this hack so that we can provide the `-pattern_type` input argument
  const firstFile = await getFirstFileInDir(jobDir)
  return new Promise((resolve, reject) => {
    // Tell fluent-ffmpeg where it can find FFmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic)

    // Run FFmpeg
    ffmpeg(firstFile)
      // Input file
      .inputOptions('-framerate', '30')
      .inputOptions('-pattern_type', 'glob')
      .inputOptions('-i', `./output/${jobDir}/*.jpg`)

      .outputOptions('-c:v', 'libx264')
      .outputOptions('-pix_fmt', 'yuv420p')

      // Output file
      .saveToFile(`./output/${jobDir}/timelapse.mp4`)
      // .saveToFile(`./output/${outputDir}/${+new Date()}.jpg`)

      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        log('Timelapse created!')
        return resolve(null)
      })

      // The callback that is run when FFmpeg encountered an error
      .on('error', (error: any) => {
        return reject(error)
      })
  })
}

export async function deleteImages(jobDir: string): Promise<null> {
  return readdir(`./output/${jobDir}`)
    .then((entries) => entries.filter((entry) => entry.endsWith('.jpg')))
    .then(tap((entries) => log(`Cleaning up job dir ${jobDir}, ${entries.length} files...`)))
    .then((entries) => Promise.all(entries.map((entry) => unlink(`./output/${jobDir}/${entry}`))))
    .then(tap(() => log('Cleanup complete!')))
    .then(() => null)
}
