let scene, camera, renderer;

const objLoader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();

function createScene() {
  return new THREE.Scene();
}

function createCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(
    75, aspectRatio, 0.1, 1000000
  );
  camera.position.set(0, 2000, -2000);
  camera.lookAt(0, 2000, 0);

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

function createCannon() {
  const cannon = new THREE.Group();
  cannon.castShadow = true;
  cannon.receiveShadow = true;

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
      cannonHeadGroup.position.y = 500;

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

  return cannon;
}

function createGround() {
  const geometry = new THREE.PlaneBufferGeometry(100000, 100000);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
  material.color.setHSL(0.095, 1, 0.75);

  const ground = new THREE.Mesh(geometry, material);

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;

  ground.receiveShadow = true;

  return ground;
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

  ground = createGround();
  scene.add(ground);

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