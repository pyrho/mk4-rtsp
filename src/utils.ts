export function log(...args: any[]) {
    console.info(`[${new Date().toISOString()}] ${args}`)
}

export const tap =
  <T>(fn: (x: T) => void) =>
  (y: T) => {
    fn(y)
    return y
  }

