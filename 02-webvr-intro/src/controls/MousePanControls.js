// eslint-disable-next-line max-len
// @source: https://github.com/facebook/react-vr/blob/4b5dd8df5df0a5223c94f3486e8c40ee2423a120/OVRUI/src/Control/MousePanControls.js

import * as THREE from 'three'

const HALF_PI = Math.PI / 2

export default class MousePanControls {
  constructor (camera, target) {
    this.yaw = camera.rotation.y
    this.pitch = camera.rotation.x
    this.camera = camera
    this.enabled = true
    this.tracking = false
    this.target = target || window

    this.connect()
  }

  connect () {
    this.target.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    this.enabled = true

    this.tracking = false
  }

  disconnect () {
    this.target.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    this.enabled = false
  }

  handleMouseDown = (e) => {
    this.tracking = true
    this.lastX = e.screenX
    this.lastY = e.screenY
  };

  handleMouseUp = () => {
    this.tracking = false
  };

  handleMouseMove = (e) => {
    if (!this.tracking) {
      return
    }

    const width = this.target.innerWidth || this.target.clientWidth
    const height = this.target.innerHeight || this.target.clientHeight

    const deltaX = (typeof this.lastX === 'number') ? e.screenX - this.lastX : 0
    const deltaY = (typeof this.lastY === 'number') ? e.screenY - this.lastY : 0
    this.lastX = e.screenX
    this.lastY = e.screenY

    this.yaw += THREE.Math.degToRad(
      deltaX / width * this.camera.fov * this.camera.aspect
    )

    this.pitch += THREE.Math.degToRad(deltaY / height * this.camera.fov)
    this.pitch = Math.max(-HALF_PI, Math.min(HALF_PI, this.pitch))
  };

  resetRotation (x, y, z) {
    this.yaw = y
    this.pitch = x
  }

  update () {
    if (!this.enabled) {
      return
    }

    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ')
  }
}
