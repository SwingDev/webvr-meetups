import * as THREE from 'three'
import GLTF2Loader from 'three-gltf2-loader'

import { Y_OFFSET } from 'root/config'
import addPmremEnvMap from 'utils/pmrem-envmap'

GLTF2Loader(THREE)

const WALL_WIDTH = 4
const WALL_HEIGHT = 4

const BOX_SIZE = 2
const BOX_SCALE = 1

const raycaster = new THREE.Raycaster()

class Wall {
  constructor (renderer) {
    this.renderer = renderer
    this.root = new THREE.Group()
  }

  init () {
    const loader = new THREE.GLTFLoader()

    return new Promise((resolve, reject) => {
      loader.load('/box/box.gltf', (object) => this.handleLoad(object, resolve))
    })
  }

  build () {
    for (let i = 0; i < WALL_WIDTH; i += 1) {
      for (let j = 0; j < WALL_HEIGHT; j += 1) {
        const model = this.model.clone()
        model.position.x = i * BOX_SIZE * BOX_SCALE
        model.position.y = j * BOX_SIZE * BOX_SCALE
        this.root.add(model)
      }
    }
  }

  hit (origin, direction) {
    raycaster.set(origin, direction)

    const intersects = raycaster.intersectObjects(this.root.children)

    for (let i = 0; i < intersects.length; i += 1) {
      const { object } = intersects[i]
      this.root.remove(object)
    }

    if (this.root.children.length === 0) {
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
        this.model = child
        this.model.scale.set(BOX_SCALE, BOX_SCALE, BOX_SCALE)
        addPmremEnvMap(this.model, this.renderer)
        this.build()
        this.setPosition()

        resolve(this.root)
      }
    })
  };
}

export default Wall
