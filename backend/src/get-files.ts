import { readdir } from 'node:fs/promises'

export function getFiles() {
    return readdir('./output').then(files => files.filter(f => !f.startsWith('.')))

}
