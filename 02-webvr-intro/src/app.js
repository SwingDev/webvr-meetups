import 'normalize.css'
import 'styles/main.scss'

import * as THREE from 'three'
import Stats from 'stats.js'

import DisplayManager from 'utils/DisplayManager'
import setVrUI from 'utils/vr-buttons'
import AppControls from 'controls/AppControls'

import makeLights from 'components/Lights'
import Sky from 'components/Sky'
import Cursor from 'components/Cursor'
import Ground from 'components/Ground'
import Turret from 'components/Turret'
import Wall from 'components/Wall'

const ASPECT_RATIO = window.innerWidth / window.innerHeight

const enableDevTools = () => {
  const stats = new Stats()

  stats.showPanel(0)
  stats.dom.style.position = 'absolute'
  stats.dom.style.left = '10px'
  stats.dom.style.top = '10px'
  document.body.appendChild(stats.dom)

  return { stats }
}

class App {
  constructor () {
    this.setScene()
    this.setRenderer()
    this.setLights()
    this.setComponents()

    this.clock = new THREE.Clock()

    this.stats = enableDevTools().stats
    this.controls = new AppControls(
      this.camera,
      this.renderer.domElement,
      {
        onButtonClick: this.handleButtonClick
      }
    )
    this.displayManager = new DisplayManager(
      this.renderer,
      this.camera,
      this.controls
    )

    this.animate()

    setVrUI(this.renderer)
    window.addEventListener('resize', this.handleResize)
  }

  setScene () {
    this.camera = new THREE.PerspectiveCamera(60, ASPECT_RATIO, 0.01, 10000)

    this.scene = new THREE.Scene()
    this.scene.add(this.camera)
    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1)
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000)
  }

  setRenderer () {
    const canvasEl = document.getElementById('scene')

    this.renderer = new THREE.WebGLRenderer({ canvas: canvasEl })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    this.renderer.setClearColor(0x000000)

    this.renderer.shadowMap.enabled = true
  }

  setComponents () {
    const sky = Sky()
    const ground = Ground()
    this.wall = new Wall(this.renderer)
    this.turret = new Turret(this.renderer)
    this.cursor = new Cursor()

    this.turret.init()
      .then(this.handleModelLoad)

    this.wall.init()
      .then(this.handleModelLoad)

    this.scene.add(this.cursor.mesh)
    this.scene.add(sky)
    this.scene.add(ground)
  }

  setLights () {
    const { hemiLight, dirLight } = makeLights()
    this.scene.add(hemiLight)
    this.scene.add(dirLight)
  }

  updateTurret () {
    const { x, y } = this.camera.rotation

    if (this.turret && this.turret.isLoaded) {
      this.turret.rotateHead(x, y)
    }
  }

  handleModelLoad = (model) => {
    this.scene.add(model)
  };

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  };

  handleButtonClick = (events) => {
    if (
      (typeof this.wall !== 'undefined') &&
      (typeof this.cursor !== 'undefined')
    ) {
      this.wall.hit(
        this.cursor.origin,
        this.cursor.direction,
        this.handleHit
      )
    }
  };

  handleHit = () => {
    this.turret.triggerSmoke()
  };

  animate = () => {
    this.render(this.clock.getDelta())
    this.displayManager.requestAnimationFrame(this.animate)
  };

  render (clockDelta) {
    if (this.cursor) {
      this.cursor.update(this.camera)
    }

    if (this.wall && this.wall.particleGroup) {
      this.wall.particleGroup.tick(clockDelta)
    }

    if (this.turret && this.turret.particleGroup) {
      this.turret.particleGroup.tick(clockDelta)
    }

    this.displayManager.frame()
    this.displayManager.render(this.scene)
    this.updateTurret()

    this.stats.update()
  }
}

// eslint-disable-next-line
new App()
