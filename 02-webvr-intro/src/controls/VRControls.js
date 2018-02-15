export default class VRControls {
  constructor (camera, vrDisplay) {
    this.camera = camera
    this._vrDisplay = vrDisplay
  }

  update (options) {
    const pose = options.frameData ? options.frameData.pose : null
    if (pose) {
      // Positional tracking from Rift-type headsets
      if (pose.position) {
        this.camera.position.fromArray(pose.position)
      }
      if (pose.orientation) {
        this.camera.quaternion.fromArray(pose.orientation)
      }
    }
  }

  get vrDisplay () {
    return this._vrDisplay
  }
}
