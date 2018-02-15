let scene, camera, renderer;

const objLoader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();

function createScene() {
  return new THREE.Scene();
}

function createCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(
    75, aspectRatio, 0.1, 10000
  );
  camera.position.set(0, 2, -3.2);
  camera.lookAt(0, 2.1, 0);

  return camera;
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

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

function createCannon() {
  const cannon = new THREE.Group();

  const cannonMaterial = new THREE.MeshPhysicalMaterial();

  cannonMaterial.normalMap = textureLoader.load(
    'assets/turret/turret_unit/DefaultMaterial_normal.png'
  );
  cannonMaterial.aoMap = textureLoader.load(
    'assets/turret/turret_unit/DefaultMaterial_occlusionRoughnessMetallic.png'
  );
  cannonMaterial.roughnessMap = textureLoader.load(
    'assets/turret/turret_unit/DefaultMaterial_occlusionRoughnessMetallic.png'
  );
  cannonMaterial.metalnessMap = textureLoader.load(
    'assets/turret/turret_unit/DefaultMaterial_occlusionRoughnessMetallic.png'
  );
  cannonMaterial.map = textureLoader.load(
    'assets/turret/turret_unit/DefaultMaterial_baseColor.png'
  );

  const skyboxTexture = textureLoader.load('assets/skybox.jpg');
  skyboxTexture.mapping = THREE.EquirectangularReflectionMapping;

  cannonMaterial.envMap = skyboxTexture;

  objLoader.load(
    'assets/turret/turret_head.obj',
    (cannonHeadGroup) => {
      const cannonHead = cannonHeadGroup.children[0];
      cannonHead.material = cannonMaterial;

      cannon.add(cannonHeadGroup);
    }
  );

  objLoader.load(
    'assets/turret/turret_legs.obj',
    (cannonLegsGroup) => {
      const cannonLegs = cannonLegsGroup.children[0];
      cannonLegs.material = cannonMaterial;

      cannon.add(cannonLegsGroup);
    }
  );

  cannon.scale.set(0.001, 0.001, 0.001);

  return cannon;
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

let cannon, skybox;
function setup() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();

  document.body.appendChild(renderer.domElement);

  addLights();

  cannon = createCannon();
  scene.add(cannon);

  skybox = createSkybox();
  scene.add(skybox);
}

const raycaster = new THREE.Raycaster();
function updateCannonDirection() {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(skybox);
  if (intersects.length > 0) {
    const cannonHead = cannon.children[0];
    if (cannonHead) {
      cannonHead.lookAt(intersects[0].point.clone().negate());
    }
  }
}

let mouse = new THREE.Vector2();
document.addEventListener(
  'mousemove',
  (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    updateCannonDirection();
  },
  false
);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

setup();
render();