import * as THREE from 'three'
import SPE from 'libs/SPE'
import GLTF2Loader from 'three-gltf2-loader'

import { Y_OFFSET, BOX_SCALE, BOX_SIZE } from 'root/config'

import addPmremEnvMap from 'utils/pmrem-envmap'
import explosionImage from 'images/sprite-explosion2.png'

GLTF2Loader(THREE)

const WALL_WIDTH = 4
const WALL_HEIGHT = 4

const raycaster = new THREE.Raycaster()
const textureLoader = new THREE.TextureLoader()

const particleSettings = {
  texture: {
    value: textureLoader.load(explosionImage),
    frames: new THREE.Vector2(5, 5),
    loop: 1
  },
  depthTest: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  maxParticleCount: 1000,
  scale: 6500
}

const emitters = [
  {
    particleCount: 20,
    type: SPE.distributions.SPHERE,
    position: {
      radius: 1
    },
    maxAge: { value: 0.7 },
    activeMultiplier: 20,
    velocity: {
      value: new THREE.Vector3(2)
    },
    size: { value: [1, 1] },
    color: {
      value: [
        new THREE.Color(0.5, 0.1, 0.05),
        new THREE.Color(0.2, 0.2, 0.2)
      ]
    },
    opacity: { value: [0.5, 0.35, 0.1, 0] }
  },
  {
    particleCount: 50,
    position: { spread: new THREE.Vector3(1, 1, 1) },
    velocity: {
      spread: new THREE.Vector3(2),
      distribution: SPE.distributions.SPHERE
    },
    size: { value: [1, 1, 1, 1] },
    maxAge: { value: 0.7 },
    activeMultiplier: 2000,
    opacity: { value: [0.5, 0.25, 0, 0] }
  }
]

const hasBoxes = (children) => (
  children.filter(child => child.isMesh).length !== 0
)

class Wall {
  constructor (renderer) {
    this.renderer = renderer
    this.root = new THREE.Group()
    this.initParticles()
  }

  init () {
    const loader = new THREE.GLTFLoader()

    return new Promise((resolve, reject) => {
      loader.load('/box/box.gltf', (object) => this.handleLoad(object, resolve))
    })
  }

  initParticles () {
    this.particleGroup = new SPE.Group(particleSettings)

    this.particleGroup.addPool(2, emitters, false)
    this.root.add(this.particleGroup.mesh)
  }

  build () {
    for (let i = 0; i < WALL_WIDTH; i += 1) {
      for (let j = 0; j < WALL_HEIGHT; j += 1) {
        const model = this.box.clone()
        model.position.x = i * BOX_SIZE * BOX_SCALE
        model.position.y = j * BOX_SIZE * BOX_SCALE
        this.root.add(model)
      }
    }
  }

  triggerExplosion (position) {
    this.particleGroup.triggerPoolEmitter(2, position)
  }

  hit (origin, direction) {
    raycaster.set(origin, direction)

    const intersects = raycaster.intersectObjects(this.root.children, true)

    for (let i = 0; i < intersects.length; i += 1) {
      const { object } = intersects[i]

      if (object.isMesh) {
        this.triggerExplosion(object.position.clone())
        this.root.remove(object)
      }
    }

    if (!hasBoxes(this.root.children)) {
      this.build()
    }
  }

  setPosition () {
    this.root.position.x = -WALL_WIDTH + (BOX_SIZE / 2)
    this.root.position.y = -Y_OFFSET + (BOX_SIZE / 2)
    this.root.position.z = -10
  }

  handleLoad = (object, resolve) => {
    object.scene.traverse((child) => {
      if (child.isMesh) {
        this.box = child
        this.box.scale.set(BOX_SCALE, BOX_SCALE, BOX_SCALE)
        addPmremEnvMap(this.box, this.renderer)

        this.build()
        this.setPosition()

        resolve(this.root)
      }
    })
  };

  frame (clockDelta) {
    if (this.particleGroup) {
      this.particleGroup.tick(clockDelta)
    }
  }
}

export default Wall
