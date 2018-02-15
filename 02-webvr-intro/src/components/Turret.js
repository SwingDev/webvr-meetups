import * as THREE from 'three'

import { Y_OFFSET } from 'root/config'
import addPmremEnvMap from 'utils/pmrem-envmap'
import loadModel from 'utils/model-loader'

const MAX_ROTATION_DEGREE = 20
const MAX_ROTATION_RAD = THREE.Math.degToRad(MAX_ROTATION_DEGREE)

const getDumped = (value) => (
  (value > MAX_ROTATION_RAD)
    ? MAX_ROTATION_RAD
    : (value < -MAX_ROTATION_RAD)
      ? -MAX_ROTATION_RAD
      : value
)

class Turrent {
  constructor (renderer) {
    this.root = new THREE.Group()
    this.isLoaded = false

    this.renderer = renderer
  }

  init () {
    return loadModel('/turret/turret.gltf')
      .then(this.handleModelsLoad)
  }

  setEnvMap () {
    addPmremEnvMap(this.head, this.renderer)
    addPmremEnvMap(this.base, this.renderer)
  }

  setPosition () {
    this.head.position.z = 0
    this.head.position.y = 0.6

    this.root.position.z = -2
    this.root.position.y = -Y_OFFSET + 0.95
  }

  setShadows () {
    this.head.castShadow = true
    this.head.receiveShadow = true
    this.base.castShadow = true
    this.base.receiveShadow = true
  }

  rotateHead (x = 0, y = 0) {
    this.head.rotation.x = getDumped(x)
    this.head.rotation.y = getDumped(y)
  }

  handleModelsLoad = (models) => {
    this.head = models.turretHead
    this.base = models.turretBase

    this.setEnvMap()
    this.setPosition()
    this.setShadows()

    this.root.add(this.head)
    this.root.add(this.base)

    this.isLoaded = true

    return this.root
  };
}

export default Turrent
