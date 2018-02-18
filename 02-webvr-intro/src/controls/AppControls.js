// eslint-disable-next-line max-len
// @source: https://github.com/facebook/react-vr/blob/a1574e94917304a1c47f539df0dc5d0f4306fba9/OVRUI/src/Control/AppControls.js

import MousePanControls from './MousePanControls'
import DeviceOrientationControls from './DeviceOrientationControls'
import VRControls from './VRControls'
import GamepadControls from './GamepadControls'

const supportsOrientation = () => (
  'DeviceOrientationEvent' in window &&
  /Mobi/i.test(navigator.userAgent) &&
  !/OculusBrowser/i.test(navigator.userAgent)
)

const defaults = {
  onButtonClick: null
}

class AppControls {
  constructor (camera, target, options) {
    this.camera = camera

    this.options = {
      ...defaults,
      ...options
    }

    this.nonVRControls = (supportsOrientation())
      ? new DeviceOrientationControls(this.camera)
      : new MousePanControls(this.camera, target)

    this.gamepad = new GamepadControls()
  }

  setVRDisplay (vrDisplay) {
    if (!vrDisplay) {
      throw new Error('When calling setVRDisplay a non-null value is expected.')
    }
    this.vrControls = new VRControls(this.camera, vrDisplay)
  }

  resetRotation (x, y, z) {
    this.nonVRControls.resetRotation(x, y, z)
  }

  frame (frameOptions) {
    const { onButtonClick } = this.options
    const gamepadEvents = this.gamepad.getEvents()

    this.gamepad.mouseEnabled = !this.nonVRControls.moving

    if (gamepadEvents && onButtonClick) {
      onButtonClick(gamepadEvents)
    }

    if (this.vrControls) {
      const display = this.vrControls.vrDisplay

      if (display && display.isPresenting) {
        return this.vrControls.update(frameOptions)
      }
    }

    this.nonVRControls.update()
  }
}

export default AppControls
