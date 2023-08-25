import got from 'got'

export function notify() {
    return got.post({url: `http://ntfy.sh/${process.env.NTFY_TOPIC}`, body: 'Print done!'})
}
