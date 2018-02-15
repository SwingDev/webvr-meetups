/* global VRFrameData */

import VREffect from './VREffect'

export default class DisplayManager {
  constructor (renderer, camera, controls) {
    this.renderer = renderer
    this.camera = camera
    this.controls = controls

    this.frameData = null
    if ('VRFrameData' in window) {
      this.frameData = new VRFrameData()
    }

    this.init()

    window.addEventListener('vrdisplayactivate', this.onDisplayActivate)
    window.addEventListener('vrdisplaydeactivate', this.onDisplayDeactivate)

    window.addEventListener('vrdisplayconnect', this.onDisplayConnect)
    window.addEventListener('vrdisplaydisconnect', this.onDisplayDisconnect)
  }

  init () {
    if (typeof navigator.getVRDisplays === 'function') {
      navigator
        .getVRDisplays()
        .then(displays => {
          if (displays.length) {
            this.setCurrentDisplay(displays[0])
            return this.enterVR()
          }
        })
        .catch(() => {})
    }
  }

  setCurrentDisplay (display) {
    this.display = display
    this.controls.setVRDisplay(display)

    if (display) {
      const { width, height } = this.renderer.getSize()

      this.effect = new VREffect(this.renderer, display)
      this.effect.setSize(width, height)
    } else {
      this.effect = null
    }
  }

  frame () {
    const frameOptions = {}
    if (this.frameData && this.display && this.display.isPresenting) {
      this.display.getFrameData(this.frameData)
      frameOptions.frameData = this.frameData
    }

    this.controls.frame(frameOptions)
    this.camera.updateMatrixWorld()
  }

  render (scene) {
    if (this.effect && this.frameData && this.display && this.display.isPresenting) {
      this.effect.render(scene, this.camera, this.frameData)
    } else {
      this.renderer.render(scene, this.camera)
    }
  }

  requestAnimationFrame = (fn) => {
    if (this.display) {
      return this.display.requestAnimationFrame(fn)
    }

    return window.requestAnimationFrame(fn)
  }

  onDisplayConnect = ({ display }) => {
    console.log('onDisplayConnect')
    if (this.display) {
      return
    }

    this.setCurrentDisplay(display)
  }

  onDisplayDisconnect = ({ display }) => {
    console.log('onDisplayDisconnect')
    if (display !== this.display) {
      return
    }

    if (typeof navigator.getVRDisplays === 'function') {
      navigator
        .getVRDisplays()
        .then(displays => {
          if (displays.length === 0) {
            this.setCurrentDisplay(displays[0])
          } else {
            this.setCurrentDisplay(null)
          }
        })
    }
  }

  onDisplayActivate = ({ display }) => {
    if (display === this.display) {
      this.enterVR()
    }
  }

  onDisplayDeactivate = ({ display }) => {
    if (display === this.display) {
      this.exitVR()
    }
  }

  enterVR = () => {
    if (!this.display || !this.effect) {
      return Promise.reject(new Error('Cannot enter VR, no display detected'))
    }

    return this.effect.requestPresent()
  }

  exitVR = () => {
    if (!this.display || !this.display.isPresenting || !this.effect) {
      return Promise.reject(new Error('Cannot exit, not currently presenting'))
    }

    return this.effect.exitPresent()
  }
}
