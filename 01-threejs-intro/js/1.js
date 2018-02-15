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
  camera.position.set(0, 0, -5);
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

function setup() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();

  document.body.appendChild(renderer.domElement);

  skybox = createSkybox();
  scene.add(skybox);
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

setup();
render();