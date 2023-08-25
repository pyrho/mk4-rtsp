import { request } from 'urllib'

interface JobData {
  id: number
  progress: number
  time_remaining: number
  time_printing: number
}

interface PrinterData {
  state: 'PRINTING' | 'FINISHED'
  temp_bed: number
  target_bed: number
  temp_nozzle: number
  target_nozzle: number
  axis_z: number

  // I have seen those two, but they don't always show up
  // axis_x: number
  // axis_y: number

  flow: number
  speed: number
  fan_hotend: number
  fan_print: number
  status_connect: unknown
}

export interface StatusData {
  job: JobData
  storage: unknown // don't care
  printer: PrinterData
}

export async function getStatus(): Promise<StatusData | null> {
  try {
    const response = await request('http://mk4.lan/api/v1/status', {
      digestAuth: process.env.DIGEST_AUTH,
      dataType: 'json',
    })
    return response.data
  } catch (e) {
    return null
  }
}
