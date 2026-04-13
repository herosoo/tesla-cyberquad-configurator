import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { createConfigurator } from './configurator.js';
import { initUI } from './ui.js';

// ─── Scene State ───
let scene, camera, renderer, controls, composer;
let model = null;
let mixer = null;
let clock = new THREE.Clock();
let idleTimer = 0;
let isUserInteracting = false;
let isNightMode = false;
let sunLight, ambientLight, fillLight, groundMesh, bgMesh;
let dustParticles;
let configurator;
let cinematicAngle = 0;
let cinematicTargetY = 0.8;

// ─── Loading Manager ───
const loadingManager = new THREE.LoadingManager();
const loadingBar = document.getElementById('loading-bar');
const loadingScreen = document.getElementById('loading-screen');
const loadingPercent = document.getElementById('loading-percent');

loadingManager.onProgress = (url, loaded, total) => {
  const progress = (loaded / total) * 100;
  if (loadingBar) loadingBar.style.width = progress + '%';
  if (loadingPercent) loadingPercent.textContent = Math.round(progress) + '%';
};

loadingManager.onLoad = () => {
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => loadingScreen.style.display = 'none', 800);
    }
    document.getElementById('app-ui')?.classList.add('visible');
  }, 400);
};

// ─── Init ───
function init() {
  const canvas = document.getElementById('canvas');

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xe0e0e0, 0.012);

  // Camera
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(5, 3, 7);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 15;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minPolarAngle = 0.2;
  controls.target.set(-2.2, 0.8, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  controls.addEventListener('start', () => {
    isUserInteracting = true;
    controls.autoRotate = false;
    idleTimer = 0;
  });

  controls.addEventListener('end', () => {
    isUserInteracting = false;
    idleTimer = 0;
  });

  // Post-processing
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.15, 0.4, 0.85
  );
  composer.addPass(bloomPass);

  // Vignette
  const vignetteShader = {
    uniforms: {
      tDiffuse: { value: null },
      offset: { value: 1.0 },
      darkness: { value: 1.2 },
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float offset;
      uniform float darkness;
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
        gl_FragColor = vec4(mix(texel.rgb, vec3(1.0 - darkness), dot(uv, uv)), texel.a);
      }
    `,
  };
  composer.addPass(new ShaderPass(vignetteShader));

  setupLighting();
  createGradientBackground();
  createGround();
  createDustParticles();
  loadModel();

  window.addEventListener('resize', onResize);
  animate();
}

// ─── Lighting (Automotive Photography Studio Rig) ───
let rimLightWarm, rimLightCool, keyLight, hairLight, bottomFill;
let overheadSoftbox, stripLightLeft, stripLightRight, frontGoodie, rearGoodie;

function setupLighting() {
  // Init RectAreaLight support
  RectAreaLightUniformsLib.init();

  const kelvin6000 = 0xfff4ea;

  // ── Soft ambient base ──
  ambientLight = new THREE.AmbientLight(kelvin6000, 0.25);
  scene.add(ambientLight);

  // ── KEY LIGHT — directional for shadows (only directional casts shadows in Three.js) ──
  sunLight = new THREE.DirectionalLight(kelvin6000, 2.0);
  sunLight.position.set(5, 10, 5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 4096;
  sunLight.shadow.mapSize.height = 4096;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.right = 10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.bottom = -10;
  sunLight.shadow.bias = -0.0001;
  sunLight.shadow.radius = 4;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);

  // ── LARGE OVERHEAD SOFTBOX (20x10) — simulates white studio ceiling ──
  // Heavy diffusion, creates clean top-down gradient on body panels
  overheadSoftbox = new THREE.RectAreaLight(kelvin6000, 8, 20, 10);
  overheadSoftbox.position.set(0, 10, 0);
  overheadSoftbox.lookAt(0, 0, 0);
  scene.add(overheadSoftbox);

  // ── LEFT STRIP LIGHT — tall vertical panel for long reflection lines on fenders ──
  stripLightLeft = new THREE.RectAreaLight(kelvin6000, 5, 2, 8);
  stripLightLeft.position.set(-7, 3, 0);
  stripLightLeft.lookAt(0, 1, 0);
  scene.add(stripLightLeft);

  // ── RIGHT STRIP LIGHT — matching panel on opposite side ──
  stripLightRight = new THREE.RectAreaLight(kelvin6000, 5, 2, 8);
  stripLightRight.position.set(7, 3, 0);
  stripLightRight.lookAt(0, 1, 0);
  scene.add(stripLightRight);

  // ── FRONT GOODIE — small emitting plane just behind camera for headlight/rim highlights ──
  frontGoodie = new THREE.RectAreaLight(kelvin6000, 4, 4, 2);
  frontGoodie.position.set(0, 2, 8);
  frontGoodie.lookAt(0, 1, 0);
  scene.add(frontGoodie);

  // ── REAR GOODIE — small emitting plane behind vehicle for taillight/crease highlights ──
  rearGoodie = new THREE.RectAreaLight(kelvin6000, 3, 4, 2);
  rearGoodie.position.set(0, 2.5, -8);
  rearGoodie.lookAt(0, 1, 0);
  scene.add(rearGoodie);

  // ── FILL LIGHT — soft directional from opposite side ──
  fillLight = new THREE.DirectionalLight(kelvin6000, 0.8);
  fillLight.position.set(-5, 4, 3);
  scene.add(fillLight);

  // ── WARM RIM — from behind-left for edge separation ──
  rimLightWarm = new THREE.DirectionalLight(kelvin6000, 1.0);
  rimLightWarm.position.set(-4, 2, -5);
  scene.add(rimLightWarm);

  // ── COOL KICKER — from behind-right ──
  rimLightCool = new THREE.DirectionalLight(kelvin6000, 0.6);
  rimLightCool.position.set(4, 3, -6);
  scene.add(rimLightCool);

  // ── BOTTOM FILL — simulates light bouncing off studio floor ──
  bottomFill = new THREE.DirectionalLight(kelvin6000, 0.3);
  bottomFill.position.set(0, -2, 0);
  scene.add(bottomFill);
}

// ─── Gradient Background ───
function createGradientBackground() {
  // Create a large sphere with gradient shader as the background
  const bgGeo = new THREE.SphereGeometry(90, 32, 32);
  const bgMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTopColor: { value: new THREE.Color(0xe8e8e8) },
      uBottomColor: { value: new THREE.Color(0xd8d8d8) },
      uMidColor: { value: new THREE.Color(0xe0e0e0) },
      uOffset: { value: 0.0 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform vec3 uMidColor;
      uniform float uOffset;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y + uOffset;
        vec3 color;
        if (h > 0.0) {
          color = mix(uMidColor, uTopColor, smoothstep(0.0, 0.6, h));
        } else {
          color = mix(uMidColor, uBottomColor, smoothstep(0.0, -0.5, h));
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  bgMesh = new THREE.Mesh(bgGeo, bgMat);
  scene.add(bgMesh);
  // Disable default scene background so shader sphere shows
  scene.background = null;
}

// ─── Ground (Studio Floor) ───
function createGround() {
  const groundGeo = new THREE.PlaneGeometry(80, 80);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.55,
    metalness: 0.15,
    envMapIntensity: 0.3,
  });
  groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.01;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Grid overlay
  const gridHelper = new THREE.GridHelper(80, 108, 0x999999, 0xaaaaaa);
  gridHelper.position.y = 0.001;
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  gridHelper.material.depthWrite = false;
  scene.add(gridHelper);
}

// ─── Dust Particles ───
function createDustParticles() {
  const count = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocities[i * 3] = (Math.random() - 0.5) * 0.008;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    sizes[i] = 0.015 + Math.random() * 0.04;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.userData.velocities = velocities;

  const material = new THREE.PointsMaterial({
    color: 0xffccaa,
    size: 0.035,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  dustParticles = new THREE.Points(geometry, material);
  scene.add(dustParticles);
}

function animateDust() {
  if (!dustParticles) return;
  const positions = dustParticles.geometry.attributes.position.array;
  const velocities = dustParticles.geometry.userData.velocities;
  const time = clock.getElapsedTime();

  for (let i = 0; i < positions.length; i += 3) {
    // Add gentle wave motion
    const wave = Math.sin(time * 0.3 + i * 0.01) * 0.002;
    positions[i] += velocities[i] + wave;
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];

    if (Math.abs(positions[i]) > 20) velocities[i] *= -1;
    if (positions[i + 1] < 0 || positions[i + 1] > 10) velocities[i + 1] *= -1;
    if (Math.abs(positions[i + 2]) > 20) velocities[i + 2] *= -1;
  }
  dustParticles.geometry.attributes.position.needsUpdate = true;
}

// ─── Load Model ───
function loadModel() {
  const loader = new GLTFLoader(loadingManager);

  // Generate a bright studio-style environment map
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0xffffff);

  // Studio environment: bright hemisphere + directional accents for realistic reflections
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xddccbb, 4.0);
  envScene.add(hemisphereLight);

  // Key softbox reflection (front-right)
  const envKeyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  envKeyLight.position.set(5, 10, 7);
  envScene.add(envKeyLight);

  // Fill softbox reflection (left)
  const envFillLight = new THREE.DirectionalLight(0xeeeeff, 2.0);
  envFillLight.position.set(-6, 6, 3);
  envScene.add(envFillLight);

  // Rim / hair reflection (back)
  const envBackLight = new THREE.DirectionalLight(0xfff0e0, 2.5);
  envBackLight.position.set(0, 5, -10);
  envScene.add(envBackLight);

  // Top reflection (overhead softbox)
  const envTopLight = new THREE.DirectionalLight(0xffffff, 1.5);
  envTopLight.position.set(0, 15, 0);
  envScene.add(envTopLight);

  const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  pmremGenerator.dispose();

  loader.load('/models/cyberquad_new.glb', (gltf) => {
    model = gltf.scene;

    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.5 / maxDim;

    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));

    // Place on the ground plane
    const groundedBox = new THREE.Box3().setFromObject(model);
    model.position.y -= groundedBox.min.y;

    // Assign PBR materials BEFORE adding to scene (avoids shader compile errors from GLTF defaults)
    const meshNames = [];
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        meshNames.push(child.name);

        // Dispose old GLTF material to prevent broken shader compile
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }

        const name = (child.name || '').toLowerCase();

        // OBJ->GLB uses object names from Blender (e.g., "Seat_Cube.005")
        // Assign PBR materials based on part classification
        const newMat = new THREE.MeshStandardMaterial({ envMapIntensity: 1.0 });

        if (name.includes('wheel') || name.includes('tire') || name.includes('tyre')) {
          newMat.color = new THREE.Color(0x1a1a1a);
          newMat.roughness = 0.85;
          newMat.metalness = 0.0;
        } else if (name.includes('frame') || name.includes('swing') || name.includes('axle') ||
                   name.includes('spring') || name.includes('shock') || name.includes('a-arm') ||
                   name.includes('linkage') || name.includes('bracket') || name.includes('hub') ||
                   name.includes('brake') || name.includes('rotor') || name.includes('caliper') ||
                   name.includes('bolt') || name.includes('nut') || name.includes('chain') ||
                   name.includes('sprocket') || name.includes('motor') || name.includes('diff') ||
                   name.includes('misc') || name.includes('cylinder') || name.includes('tube') ||
                   name.includes('pipe') || name.includes('rod') || name.includes('pin') ||
                   name.includes('mount') || name.includes('clamp') || name.includes('spacer') ||
                   name.includes('bearing') || name.includes('flange') || name.includes('plate_circle')) {
          newMat.color = new THREE.Color(0x1a1a1a);
          newMat.roughness = 0.3;
          newMat.metalness = 0.8;
        } else if (name.includes('handlebar') || name.includes('grip') || name.includes('lever') ||
                   name.includes('throttle') || name.includes('mirror') || name.includes('steer')) {
          newMat.color = new THREE.Color(0x222222);
          newMat.roughness = 0.25;
          newMat.metalness = 0.85;
        } else if (name.includes('seat') || name.includes('cushion') || name.includes('pad')) {
          newMat.color = new THREE.Color(0x111111);
          newMat.roughness = 0.7;
          newMat.metalness = 0.0;
        } else if (name.includes('body') || name.includes('fender') || name.includes('fairing') ||
                   name.includes('hood') || name.includes('panel') || name.includes('bumper') ||
                   name.includes('nose') || name.includes('wing') || name.includes('cover') ||
                   name.includes('shroud') || name.includes('shield') || name.includes('front_piece')) {
          // Stainless steel alloy body panels
          newMat.color = new THREE.Color(0xb0b0b0);
          newMat.roughness = 0.18;
          newMat.metalness = 1.0;
        } else if (name.includes('light') || name.includes('lamp') || name.includes('led')) {
          newMat.color = new THREE.Color(0xffffff);
          newMat.roughness = 0.1;
          newMat.metalness = 0.0;
          newMat.emissive = new THREE.Color(0x333333);
        } else {
          // Default: dark metallic
          newMat.color = new THREE.Color(0x2a2a2a);
          newMat.roughness = 0.35;
          newMat.metalness = 0.6;
        }

        child.material = newMat;
      }
    });

    scene.add(model);

    // Init configurator after model loads
    configurator = createConfigurator(model, scene);
    initUI(configurator, {
      toggleDayNight,
      setCameraView,
      setEnvironment,
    });

    // Adjust camera to fit
    controls.target.set(-2.2, size.y * scale * 0.4, 0);
    camera.position.set(4.2, 2.5, 6);
    controls.update();
  });
}

// ─── Day/Night Toggle ───
function toggleDayNight() {
  isNightMode = !isNightMode;

  const duration = 1200;
  const start = performance.now();

  // Gradient background colors
  const bgUniforms = bgMesh.material.uniforms;
  const fromTop = bgUniforms.uTopColor.value.clone();
  const fromMid = bgUniforms.uMidColor.value.clone();
  const fromBottom = bgUniforms.uBottomColor.value.clone();
  const toTop = isNightMode ? new THREE.Color(0x0a0820) : new THREE.Color(0xe8e8e8);
  const toMid = isNightMode ? new THREE.Color(0x150e35) : new THREE.Color(0xe0e0e0);
  const toBottom = isNightMode ? new THREE.Color(0x1a1040) : new THREE.Color(0xd8d8d8);

  const fromFog = scene.fog.color.clone();
  const toFog = isNightMode ? new THREE.Color(0x0a0820) : new THREE.Color(0xe0e0e0);
  const fromSunIntensity = sunLight.intensity;
  const toSunIntensity = isNightMode ? 0.3 : 2.0;
  const fromAmbientIntensity = ambientLight.intensity;
  const toAmbientIntensity = isNightMode ? 0.1 : 0.25;
  const fromGroundColor = groundMesh.material.color.clone();
  const toGroundColor = isNightMode ? new THREE.Color(0x121220) : new THREE.Color(0x555555);
  const fromWarmIntensity = rimLightWarm.intensity;
  const toWarmIntensity = isNightMode ? 0.3 : 1.0;
  const fromCoolIntensity = rimLightCool.intensity;
  const toCoolIntensity = isNightMode ? 1.2 : 0.6;
  // RectAreaLight intensities
  const fromOverhead = overheadSoftbox.intensity;
  const toOverhead = isNightMode ? 2.0 : 8.0;
  const fromStripL = stripLightLeft.intensity;
  const toStripL = isNightMode ? 1.5 : 5.0;
  const fromStripR = stripLightRight.intensity;
  const toStripR = isNightMode ? 1.5 : 5.0;
  const fromFrontG = frontGoodie.intensity;
  const toFrontG = isNightMode ? 1.0 : 4.0;
  const fromRearG = rearGoodie.intensity;
  const toRearG = isNightMode ? 0.8 : 3.0;

  function animateTransition() {
    const elapsed = performance.now() - start;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    bgUniforms.uTopColor.value.lerpColors(fromTop, toTop, ease);
    bgUniforms.uMidColor.value.lerpColors(fromMid, toMid, ease);
    bgUniforms.uBottomColor.value.lerpColors(fromBottom, toBottom, ease);
    scene.fog.color.lerpColors(fromFog, toFog, ease);
    sunLight.intensity = fromSunIntensity + (toSunIntensity - fromSunIntensity) * ease;
    ambientLight.intensity = fromAmbientIntensity + (toAmbientIntensity - fromAmbientIntensity) * ease;
    groundMesh.material.color.lerpColors(fromGroundColor, toGroundColor, ease);
    rimLightWarm.intensity = fromWarmIntensity + (toWarmIntensity - fromWarmIntensity) * ease;
    rimLightCool.intensity = fromCoolIntensity + (toCoolIntensity - fromCoolIntensity) * ease;
    overheadSoftbox.intensity = fromOverhead + (toOverhead - fromOverhead) * ease;
    stripLightLeft.intensity = fromStripL + (toStripL - fromStripL) * ease;
    stripLightRight.intensity = fromStripR + (toStripR - fromStripR) * ease;
    frontGoodie.intensity = fromFrontG + (toFrontG - fromFrontG) * ease;
    rearGoodie.intensity = fromRearG + (toRearG - fromRearG) * ease;

    if (dustParticles) {
      dustParticles.material.opacity = isNightMode ? 0.15 * ease + 0.1 : 0.3 * ease;
      dustParticles.material.color.lerpColors(
        new THREE.Color(0xffccaa),
        isNightMode ? new THREE.Color(0x6644cc) : new THREE.Color(0xffccaa),
        ease
      );
    }

    if (t < 1) requestAnimationFrame(animateTransition);
  }

  animateTransition();
  return isNightMode;
}

// ─── Camera Views ───
function setCameraView(view) {
  const duration = 1200;
  const start = performance.now();
  const fromPos = camera.position.clone();
  const fromTarget = controls.target.clone();
  let toPos, toTarget;

  const targetY = model ? model.position.y + 1.2 : 1.2;
  toTarget = new THREE.Vector3(-2.2, targetY, 0);

  switch (view) {
    case 'front':
      toPos = new THREE.Vector3(0, 2, 7);
      break;
    case 'side':
      toPos = new THREE.Vector3(7, 2, 0);
      break;
    case 'rear':
      toPos = new THREE.Vector3(0, 2.5, -7);
      break;
    case 'top':
      toPos = new THREE.Vector3(0, 8, 0.1);
      break;
    default:
      toPos = new THREE.Vector3(5, 2.5, 6);
  }

  controls.autoRotate = false;

  function animateCamera() {
    const elapsed = performance.now() - start;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(fromPos, toPos, ease);
    controls.target.lerpVectors(fromTarget, toTarget, ease);
    controls.update();

    if (t < 1) requestAnimationFrame(animateCamera);
    else {
      idleTimer = 0;
    }
  }

  animateCamera();
}

// ─── Resize ───
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// ─── Animation Loop ───
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Cinematic idle camera
  if (!isUserInteracting) {
    idleTimer += delta;
    if (idleTimer > 3) {
      controls.autoRotate = false; // We handle orbit manually
      cinematicAngle += delta * 0.15; // Slow orbit
      const radius = 7 + Math.sin(elapsed * 0.1) * 1.5;
      const height = 2.5 + Math.sin(elapsed * 0.15) * 1.0;
      camera.position.x += (Math.cos(cinematicAngle) * radius - camera.position.x) * 0.02;
      camera.position.z += (Math.sin(cinematicAngle) * radius - camera.position.z) * 0.02;
      camera.position.y += (height - camera.position.y) * 0.02;
      // Subtle target sway
      const targetY = (model ? model.position.y + 1.2 : 1.2) + Math.sin(elapsed * 0.2) * 0.1;
      controls.target.x += (-2.2 - controls.target.x) * 0.02;
      controls.target.y += (targetY - controls.target.y) * 0.02;
    }
  }

  controls.update();
  animateDust();

  if (mixer) mixer.update(delta);

  composer.render();
}

// ─── Start ───
init();

// ─── Environment Presets ───
const ENV_PRESETS = {
  default: {
    top: new THREE.Color(0xe8e8e8),
    mid: new THREE.Color(0xe0e0e0),
    bottom: new THREE.Color(0xd8d8d8),
    fog: new THREE.Color(0xe0e0e0),
    fogDensity: 0.012,
    ground: new THREE.Color(0x555555),
    groundRoughness: 0.2,
    groundMetalness: 0.6,
    sunIntensity: 2.0,
    ambientIntensity: 0.25,
    overheadIntensity: 8.0,
    sunColor: 0xfff4ea,
    exposure: 1.8,
  },
  sport: {
    // Dramatic mountain / rock terrain — cool contrast
    top: new THREE.Color(0x6b7d95),
    mid: new THREE.Color(0x3d4f63),
    bottom: new THREE.Color(0x252d38),
    fog: new THREE.Color(0x4a5568),
    fogDensity: 0.008,
    ground: new THREE.Color(0x3a3a40),
    groundRoughness: 0.55,
    groundMetalness: 0.3,
    sunIntensity: 2.5,
    ambientIntensity: 0.2,
    overheadIntensity: 6.0,
    sunColor: 0xd4e0f0,
    exposure: 1.6,
  },
  farm: {
    // Open golden field — warm bright pastoral
    top: new THREE.Color(0x7cb5e3),
    mid: new THREE.Color(0xd4c69a),
    bottom: new THREE.Color(0x8b7d4a),
    fog: new THREE.Color(0xd4c5a0),
    fogDensity: 0.006,
    ground: new THREE.Color(0x6b7e3d),
    groundRoughness: 0.75,
    groundMetalness: 0.05,
    sunIntensity: 2.8,
    ambientIntensity: 0.35,
    overheadIntensity: 7.0,
    sunColor: 0xffe8c0,
    exposure: 2.0,
  },
  hunting: {
    // Dense forest — dark moody misty
    top: new THREE.Color(0x4a5a4a),
    mid: new THREE.Color(0x253025),
    bottom: new THREE.Color(0x141c14),
    fog: new THREE.Color(0x2a352a),
    fogDensity: 0.025,
    ground: new THREE.Color(0x2a3528),
    groundRoughness: 0.8,
    groundMetalness: 0.05,
    sunIntensity: 1.0,
    ambientIntensity: 0.15,
    overheadIntensity: 3.5,
    sunColor: 0xd4dcc8,
    exposure: 1.4,
  },
};

let currentEnvId = 'default';

function setEnvironment(presetId) {
  const envId = presetId || 'default';
  if (envId === currentEnvId) return;

  const env = ENV_PRESETS[envId];
  if (!env) return;

  currentEnvId = envId;

  const duration = 1400;
  const start = performance.now();

  // Snapshot current values
  const bgU = bgMesh.material.uniforms;
  const fromTop = bgU.uTopColor.value.clone();
  const fromMid = bgU.uMidColor.value.clone();
  const fromBottom = bgU.uBottomColor.value.clone();
  const fromFog = scene.fog.color.clone();
  const fromFogDensity = scene.fog.density;
  const fromGround = groundMesh.material.color.clone();
  const fromGroundRoughness = groundMesh.material.roughness;
  const fromGroundMetalness = groundMesh.material.metalness;
  const fromSunIntensity = sunLight.intensity;
  const fromAmbientIntensity = ambientLight.intensity;
  const fromOverheadIntensity = overheadSoftbox.intensity;
  const fromSunColor = sunLight.color.clone();
  const fromExposure = renderer.toneMappingExposure;

  const toSunColor = new THREE.Color(env.sunColor);

  function animateEnv() {
    const elapsed = performance.now() - start;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    bgU.uTopColor.value.lerpColors(fromTop, env.top, ease);
    bgU.uMidColor.value.lerpColors(fromMid, env.mid, ease);
    bgU.uBottomColor.value.lerpColors(fromBottom, env.bottom, ease);
    scene.fog.color.lerpColors(fromFog, env.fog, ease);
    scene.fog.density = fromFogDensity + (env.fogDensity - fromFogDensity) * ease;
    groundMesh.material.color.lerpColors(fromGround, env.ground, ease);
    groundMesh.material.roughness = fromGroundRoughness + (env.groundRoughness - fromGroundRoughness) * ease;
    groundMesh.material.metalness = fromGroundMetalness + (env.groundMetalness - fromGroundMetalness) * ease;
    sunLight.intensity = fromSunIntensity + (env.sunIntensity - fromSunIntensity) * ease;
    ambientLight.intensity = fromAmbientIntensity + (env.ambientIntensity - fromAmbientIntensity) * ease;
    overheadSoftbox.intensity = fromOverheadIntensity + (env.overheadIntensity - fromOverheadIntensity) * ease;
    sunLight.color.lerpColors(fromSunColor, toSunColor, ease);
    fillLight.color.lerpColors(fromSunColor, toSunColor, ease);
    renderer.toneMappingExposure = fromExposure + (env.exposure - fromExposure) * ease;

    if (t < 1) requestAnimationFrame(animateEnv);
  }

  animateEnv();
}

export { scene, camera, renderer, controls, model, setEnvironment };
