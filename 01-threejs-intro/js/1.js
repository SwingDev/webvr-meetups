const textureLoader = new THREE.TextureLoader();

let scene;
function createScene() {
  return new THREE.Scene();
}

let renderer;
function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}

let camera;
function createCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(
    75, aspectRatio, 0.1, 1000000
  );
  camera.position.set(0, 2000, -4000);
  camera.lookAt(0, 2000, 0);

  return camera;
}

function createGround() {
  const geometry = new THREE.PlaneBufferGeometry(100000, 100000);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x050505
  });
  material.color.setHSL(0.095, 1, 0.75);

  const ground = new THREE.Mesh(geometry, material);

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;

  return ground;
}

function addLights() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 0.75, 0.5);
  hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
  hemiLight.position.set(0, 50000, 0);

  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-1, 0.75, 1);
  dirLight.position.multiplyScalar(5000);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  scene.add(dirLight);
}

function setup() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();

  document.body.appendChild(renderer.domElement);

  skybox = createSkybox();
  scene.add(skybox);

  ground = createGround();
  scene.add(ground);

  addLights();
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

setup();
render();