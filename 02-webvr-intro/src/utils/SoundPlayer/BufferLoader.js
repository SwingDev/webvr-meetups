// @reference: https://www.html5rocks.com/en/tutorials/webaudio/intro/
// @source: https://gist.github.com/Rockncoder/7371271

class BufferLoader {
  constructor (context, urlList, callback) {
    this.context = context
    this.urlList = urlList
    this.onload = callback
    this.bufferList = {}
    this.loadCount = 0
  }

  loadBuffer (url, name) {
    // Load buffer asynchronously
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = () => {
      // Asynchronously decode the audio file data in request.response
      this.context.decodeAudioData(
        request.response,
        (buffer) => {
          if (!buffer) {
            alert('error decoding file data: ' + url)
            return
          }
          this.bufferList[name] = buffer
          if (++this.loadCount === Object.keys(this.urlList).length) {
            this.onload(this.bufferList)
          }
        },
        (error) => {
          console.error('decodeAudioData error', error)
        }
      )
    }

    request.onerror = function () {
      alert('BufferLoader: XHR error')
    }

    request.send()
  }

  load () {
    Object.keys(this.urlList).forEach((key) => {
      this.loadBuffer(this.urlList[key], key)
    })
  }
}

export default BufferLoader
