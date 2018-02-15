import * as THREE from 'three'
import GLTF2Loader from 'three-gltf2-loader'

import { Y_OFFSET } from 'root/config'

GLTF2Loader(THREE)

const WALL_WIDTH = 4
const WALL_HEIGHT = 4

const BOX_SCALE = 1

class Wall {
  constructor (model) {
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
        model.position.x = (i - (WALL_WIDTH / 4)) * 2
        model.position.y = j * 2
        this.root.add(model)
      }
    }
  }

  setPosition () {
    this.root.position.y = -Y_OFFSET
    this.root.position.z = -7
  }

  handleLoad = (object, resolve) => {
    object.scene.traverse((child) => {
      if (child.isMesh) {
        this.model = child
        this.model.scale.set(BOX_SCALE, BOX_SCALE, BOX_SCALE)
        this.build()
        this.setPosition()

        resolve(this.root)
      }
    })
  };
}

export default Wall
