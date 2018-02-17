import * as THREE from 'three'
import SPE from 'libs/SPE'

import { Y_OFFSET } from 'root/config'
import addPmremEnvMap from 'utils/pmrem-envmap'
import loadModel from 'utils/model-loader'

import smokeImage from 'images/smokeparticle.png'

const MAX_ROTATION_DEGREE = 20
const MAX_ROTATION_RAD = THREE.Math.degToRad(MAX_ROTATION_DEGREE)

const textureLoader = new THREE.TextureLoader()

const particleSettings = {
  texture: {
    value: textureLoader.load(smokeImage)
  },
  depthTest: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
  maxParticleCount: 1000,
  scale: 6000
}

const emitters = [
  {
    particleCount: 30,
    type: SPE.distributions.SPHERE,
    position: {
      radius: 0.1
    },
    maxAge: {
      value: 1
    },
    activeMultiplier: 40,
    velocity: {
      value: new THREE.Vector3(1)
    },
    size: { value: 0.2 },
    opacity: { value: [0.4, 0] }
  },
  {
    particleCount: 50,
    type: SPE.distributions.SPHERE,
    position: {
      spread: new THREE.Vector3(1, 1, 1)
    },
    maxAge: { value: 1 },
    activeMultiplier: 2000,
    velocity: {
      value: new THREE.Vector3(1)
    },
    size: { value: 0.2 },
    color: {
      value: new THREE.Color(0.2, 0.2, 0.2)
    },
    opacity: { value: [0, 0, 0.2, 0] }
  }
]

const getDumped = (value) => (
  (value > MAX_ROTATION_RAD)
    ? MAX_ROTATION_RAD
    : (value < -MAX_ROTATION_RAD)
      ? -MAX_ROTATION_RAD
      : value
)

const smokePosition = new THREE.Vector3(0, 0.5, -1)

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

  initParticles () {
    this.particleGroup = new SPE.Group(particleSettings)

    this.particleGroup.addPool(2, emitters, false)
    this.headGroup.add(this.particleGroup.mesh)
  }

  setEnvMap () {
    addPmremEnvMap(this.head, this.renderer)
    addPmremEnvMap(this.base, this.renderer)
  }

  setPosition () {
    this.headGroup.position.y = 0.5

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
    this.headGroup.rotation.x = getDumped(x)
    this.headGroup.rotation.y = getDumped(y)
  }

  triggerSmoke () {
    this.particleGroup.triggerPoolEmitter(2, smokePosition)
  }

  handleModelsLoad = (models) => {
    this.head = models.turretHead
    this.base = models.turretBase

    this.headGroup = new THREE.Group()
    this.headGroup.add(this.head)

    this.setEnvMap()
    this.setPosition()
    this.setShadows()
    this.initParticles()

    this.root.add(this.headGroup)
    this.root.add(this.base)

    this.isLoaded = true

    return this.root
  };
}

export default Turrent
