// eslint-disable-next-line max-len
// @source: https://github.com/facebook/react-vr/blob/4b5dd8df5df0a5223c94f3486e8c40ee2423a120/OVRUI/src/Control/DeviceOrientationControls.js

import * as THREE from 'three'

const Y_UNIT = new THREE.Vector3(0, 1, 0)
const Z_UNIT = new THREE.Vector3(0, 0, 1)

const SCREEN_ROTATION = new THREE.Quaternion(
  -Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)
)

const rotation = new THREE.Quaternion()
const euler = new THREE.Euler()

const getScreenOrientation = () => {
  const orientation = (
    screen.orientation || screen.mozOrientation || screen.msOrientation || {}
  )

  const angle = orientation.angle || window.orientation || 0
  return THREE.Math.degToRad(angle)
}

export default class DeviceOrientationControls {
  constructor (camera) {
    this.camera = camera
    this.enabled = true

    this.screenOrientation = getScreenOrientation()
    this.deviceOrientation = {}

    this._initialAlpha = null

    this.connect()
  }

  connect () {
    this.screenOrientation = getScreenOrientation()

    window.addEventListener(
      'orientationchange',
      this.handleOrientationChange
    )

    window.addEventListener(
      'deviceorientation',
      this.handleDeviceOrientation
    )

    this.enabled = true
  }

  disconnect () {
    window.removeEventListener(
      'orientationchange',
      this.handleOrientationChange
    )

    window.removeEventListener(
      'deviceorientation',
      this.handleDeviceOrientation
    )

    this.enabled = false
  }

  handleOrientationChange = () => {
    this.screenOrientation = getScreenOrientation()
  };

  handleDeviceOrientation = (event) => {
    const alpha = THREE.Math.degToRad(event.alpha)
    const beta = THREE.Math.degToRad(event.beta)
    const gamma = THREE.Math.degToRad(event.gamma)

    if (this._initialAlpha === null) {
      this._initialAlpha = alpha - getScreenOrientation()
    }

    this.deviceOrientation.alpha = alpha
    this.deviceOrientation.beta = beta
    this.deviceOrientation.gamma = gamma
  };

  update () {
    if (!this.enabled) {
      return
    }
    const alpha = this.deviceOrientation.alpha || 0
    const beta = this.deviceOrientation.beta || 0
    const gamma = this.deviceOrientation.gamma || 0
    const orientation = this.screenOrientation

    // Update the camera rotation quaternion
    const quaternion = this.camera.quaternion
    euler.set(beta, alpha, -gamma, 'YXZ')
    quaternion.setFromEuler(euler)

    if (this._initialAlpha !== null) {
      rotation.setFromAxisAngle(Y_UNIT, -this._initialAlpha)
      quaternion.premultiply(rotation)
    }

    quaternion.multiply(SCREEN_ROTATION)
    rotation.setFromAxisAngle(Z_UNIT, -orientation)
    quaternion.multiply(rotation)
  }
}
