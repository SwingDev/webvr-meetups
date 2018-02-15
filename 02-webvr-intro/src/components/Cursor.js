import * as THREE from 'three'

import CrosshairImage from 'images/crosshair.png'

const DEFAULT_CURSOR_DISTANCE = 1
const DEFAULT_CURSOR_WIDTH = 0.05

const origin = new THREE.Vector3()
const vector = new THREE.Vector3()

class Cursor {
  constructor () {
    const texture = new THREE.TextureLoader().load(CrosshairImage)

    const geometry = new THREE.PlaneGeometry(
      DEFAULT_CURSOR_WIDTH,
      DEFAULT_CURSOR_WIDTH
    )

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      map: texture
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.raycast = () => null
    this.mesh.renderOrder = 1
  }

  update (camera) {
    const direction = camera.getWorldDirection(vector)

    const x = origin.x + direction.x * DEFAULT_CURSOR_DISTANCE
    const y = origin.y + direction.y * DEFAULT_CURSOR_DISTANCE
    const z = origin.z + direction.z * DEFAULT_CURSOR_DISTANCE

    this.mesh.position.set(
      camera.position.x + x,
      camera.position.y + y,
      camera.position.z + z
    )

    this.mesh.rotation.copy(camera.getWorldRotation())
  }
}

export default Cursor
