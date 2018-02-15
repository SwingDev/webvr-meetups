let scene, camera, renderer;

const textureLoader = new THREE.TextureLoader();

function createScene() {
  return new THREE.Scene();
}

function createCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(
    75, aspectRatio, 0.1, 10000
  );
  camera.position.set(0, 2, -5);
  camera.lookAt(0, 0, 0);

  return camera;
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}

function createSkybox() {
  const geometry = new THREE.SphereGeometry(1000, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(
      'assets/skybox.jpg'
    ),
    side: THREE.BackSide
  });

  const skybox = new THREE.Mesh(geometry, material);

  return skybox;
}

function addLights() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 0.75, 0.5);
  hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
  hemiLight.position.set(0, 500, 0);

  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-1, 0.75, 1);
  dirLight.position.multiplyScalar(50);

  scene.add(dirLight);
}

function createCube() {
  const fragmentShader = `
    precision highp float;

    varying vec3 vNormal;

    void main () {
      gl_FragColor = vec4(vNormal, 1.0);
    }
  `;
  const vertexShader = `
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    varying vec3 vNormal;

    void main () {
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.RawShaderMaterial({
    vertexShader, fragmentShader
  });
  // const material = new THREE.MeshStandardMaterial({
  //   color: 0xFFFFFF,
  //   metalness: 0.2,
  //   roughness: 0.2
  // });
  const cube = new THREE.Mesh(geometry, material);

  return cube;
}

let cube, skybox;
function setup() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();

  document.body.appendChild(renderer.domElement);

  addLights();

  skybox = createSkybox();
  scene.add(skybox);

  cube = createCube();
  scene.add(cube);
}

function render() {
  cube.rotation.y += 0.02;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

setup();
render();