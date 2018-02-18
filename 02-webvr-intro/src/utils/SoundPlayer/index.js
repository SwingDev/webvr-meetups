import BufferLoader from './BufferLoader'

const sounds = {
  shot: '/cannon-shot.mp3',
  explosion: '/box-explosion.mp3'
}

class SoundPlayer {
  constructor () {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.bufferLoader = new BufferLoader(
      this.context,
      sounds,
      this.handleLoad
    )

    this.loaded = false
    this.bufferLoader.load()
  }

  handleLoad = () => {
    this.loaded = true
  }

  play (soundName) {
    const source = this.context.createBufferSource()
    source.buffer = this.bufferLoader.bufferList[soundName]

    source.connect(this.context.destination)
    source.start(0)
  }
}

export default new SoundPlayer()
