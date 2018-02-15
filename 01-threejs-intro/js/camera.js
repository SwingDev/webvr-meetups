let scene, camera, renderer;

const textureLoader = new THREE.TextureLoader();

function createScene() {
  return new THREE.Scene();
}

function createProjectionCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight * 2;
  const camera = new THREE.PerspectiveCamera(
    90, aspectRatio, 0.1, 1000
  );
  camera.position.set(0, 0, -5);
  camera.lookAt(0, 0, 0);

  return camera;
}

function createOrthographicCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight * 2;
  const screenSize = 7;

  const camera = new THREE.OrthographicCamera(
    -screenSize, screenSize, screenSize / aspectRatio, -screenSize / aspectRatio,
    0.1, 1000
  );
  camera.position.set(0, 0, -5);
  camera.lookAt(0, 0, 0);

  return camera;
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.setSize(window.innerWidth, window.innerHeight / 2);

  return renderer;
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
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.2,
    roughness: 0.2
  });
  const cube = new THREE.Mesh(geometry, material);

  return cube;
}

function setup() {
  scene = createScene();

  camera = createOrthographicCamera();
  camera2 = createProjectionCamera();

  renderer = createRenderer();
  renderer2 = createRenderer();

  document.body.appendChild(renderer.domElement);
  document.body.appendChild(renderer2.domElement);

  addLights();

  for (var x = -4; x <= 4; x += 1) {
    for (var y = -4; y <= 4; y += 1) {
      for (var z = 0; z < 2; z += 1) {
        cube = createCube();
        cube.position.set(x, y, z)
        scene.add(cube);
      }
    }
  }
}

function render() {
  renderer.render(scene, camera);
  renderer2.render(scene, camera2);
  requestAnimationFrame(render);
}

setup();
render();