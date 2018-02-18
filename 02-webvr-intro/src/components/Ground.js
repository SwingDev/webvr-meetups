import * as THREE from 'three'

import { Y_OFFSET } from 'root/config'

export default function () {
  const geometry = new THREE.PlaneBufferGeometry(500, 500)
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x050505
  })

  material.color.setHSL(0.095, 1, 0.75)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true

  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -Y_OFFSET

  return mesh
}
