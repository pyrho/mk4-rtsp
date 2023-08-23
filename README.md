TITLE
=====

Goals
-----
- [x] poll the /status URL
- [x] grab an image from the camera every Z change
- [x] curl 'http://mk4.lan/api/v1/status' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0' -H 'Accept: application/json' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Referer: http://mk4.lan/' -H 'DNT: 1' -H 'Authorization: Digest username="maker", realm="Printer API", nonce="ba2ebb420000f7b0", uri="/api/v1/status", response="411d542a4495fb1c952a44fc26a1c661"' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache'
- [ ] notify on end via ntfy.sh
- [ ] create time-lapse:
    - `ffmpeg -framerate 500 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p out2.mp4`
- [ ] take arguments (layer height etc.)
