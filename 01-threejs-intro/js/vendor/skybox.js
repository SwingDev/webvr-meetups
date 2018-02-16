
function createSkybox() {
  const vertexShader = `
      varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
  `;
  const fragmentShader = `
			uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
      varying vec3 vWorldPosition;

			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
			}
  `;

  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  };
  uniforms.topColor.value.setHSL(0.095, 1, 0.75);

  const geometry = new THREE.SphereGeometry(100000, 32, 15);
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, side: THREE.BackSide });

  const skybox = new THREE.Mesh(geometry, material);

  return skybox;
}