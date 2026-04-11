import * as THREE from 'three';

// ─── Configuration Options ───
export const CONFIG = {
  colors: [
    { id: 'raw-steel', name: 'Raw Stainless', color: '#b0b0b0', metalness: 1.0, roughness: 0.18, price: 0 },
    { id: 'brushed-steel', name: 'Brushed Steel', color: '#a0a0a0', metalness: 1.0, roughness: 0.35, price: 1000 },
    { id: 'dark-steel', name: 'Dark Stainless', color: '#5a5a5e', metalness: 1.0, roughness: 0.2, price: 1500 },
    { id: 'mars-red', name: 'Mars Red', color: '#8b1a1a', metalness: 0.95, roughness: 0.2, price: 2000 },
    { id: 'cyber-orange', name: 'Cyber Orange', color: '#d4652a', metalness: 0.95, roughness: 0.22, price: 2000 },
    { id: 'ultra-blue', name: 'Ultra Blue', color: '#1e3a5f', metalness: 0.95, roughness: 0.2, price: 2000 },
  ],
  wheels: [
    { id: 'standard', name: 'Standard 20"', scale: 1.0, roughness: 0.5, price: 0, desc: 'All-terrain balanced' },
    { id: 'offroad', name: 'Off-Road 22"', scale: 1.12, roughness: 0.7, price: 1500, desc: 'Maximum traction' },
    { id: 'performance', name: 'Performance 19"', scale: 0.95, roughness: 0.3, price: 2000, desc: 'Track-focused grip' },
  ],
  suspension: [
    { id: 'standard', name: 'Standard', heightOffset: 0, price: 0, desc: 'Comfort-tuned adaptive' },
    { id: 'performance', name: 'Performance', heightOffset: -0.05, price: 2500, desc: 'Lowered, sport-tuned' },
    { id: 'offroad', name: 'Off-Road', heightOffset: 0.12, price: 3000, desc: 'Raised, long-travel' },
  ],
  cargo: [
    { id: 'none', name: 'None', price: 0 },
    { id: 'rear', name: 'Rear Storage', price: 800, desc: '15L sealed compartment' },
    { id: 'extended', name: 'Extended Cargo', price: 1500, desc: '40L modular cargo system' },
  ],
  rack: [
    { id: 'none', name: 'None', price: 0 },
    { id: 'utility', name: 'Utility Rack', price: 600, desc: 'Heavy-duty load bearing' },
    { id: 'sport', name: 'Sport Rack', price: 900, desc: 'Aerodynamic low-profile' },
  ],
  protection: [
    { id: 'none', name: 'None', price: 0 },
    { id: 'skid', name: 'Skid Plates', price: 700, desc: 'Underbody armor' },
    { id: 'full', name: 'Full Guard', price: 1400, desc: 'Complete protection package' },
  ],
};

export const BASE_PRICE = 3990;

export function createConfigurator(model, scene) {
  const state = {
    color: CONFIG.colors[0],
    wheels: CONFIG.wheels[0],
    suspension: CONFIG.suspension[0],
    cargo: CONFIG.cargo[0],
    rack: CONFIG.rack[0],
    protection: CONFIG.protection[0],
  };

  // Collect body meshes from model
  const bodyMeshes = [];
  const wheelMeshes = [];
  const allMeshes = [];

  model.traverse((child) => {
    if (child.isMesh) {
      allMeshes.push(child);
      // Store original material
      child.userData.originalMaterial = child.material.clone();
    }
  });

  // Classify meshes by name
  // OBJ names from Blender: "Seat_Cube.005", "Main_Body_Cube.001", etc.
  const bodyKeywords = ['body', 'fender', 'fairing', 'hood', 'panel', 'bumper', 'nose',
                        'wing', 'cover', 'shroud', 'shield', 'front_piece'];
  const wheelKeywords = ['wheel', 'tire', 'tyre', 'rim'];

  allMeshes.forEach((mesh) => {
    const name = (mesh.name || '').toLowerCase();

    if (wheelKeywords.some(w => name.includes(w))) {
      wheelMeshes.push(mesh);
    } else if (bodyKeywords.some(b => name.includes(b))) {
      bodyMeshes.push(mesh);
    }
    // Everything else (frame, seat, handlebars, misc, etc.) left alone
  });

  // Apply default stainless steel — keep texture maps (roughnessMap, map) intact
  bodyMeshes.forEach((mesh) => {
    mesh.material.color.set(CONFIG.colors[0].color);
    mesh.material.metalness = CONFIG.colors[0].metalness;
    mesh.material.roughness = CONFIG.colors[0].roughness;
    mesh.material.needsUpdate = true;
  });

  // Accessory meshes (procedurally generated)
  const accessories = {
    cargo: null,
    rack: null,
    protection: null,
  };

  function createAccessoryMesh(type, config) {
    // Remove existing
    if (accessories[type]) {
      scene.remove(accessories[type]);
      accessories[type].geometry.dispose();
      accessories[type].material.dispose();
      accessories[type] = null;
    }

    if (config.id === 'none') return;

    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.8,
      roughness: 0.3,
    });

    let geo;
    const modelBox = new THREE.Box3().setFromObject(model);
    const modelSize = modelBox.getSize(new THREE.Vector3());
    const modelCenter = modelBox.getCenter(new THREE.Vector3());

    if (type === 'cargo') {
      const w = config.id === 'extended' ? modelSize.x * 0.3 : modelSize.x * 0.2;
      const h = config.id === 'extended' ? modelSize.y * 0.12 : modelSize.y * 0.1;
      const d = config.id === 'extended' ? modelSize.z * 0.2 : modelSize.z * 0.12;
      geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        modelCenter.x,
        modelCenter.y - modelSize.y * 0.05,
        modelCenter.z - modelSize.z * 0.38
      );
      mesh.castShadow = true;
      scene.add(mesh);
      accessories.cargo = mesh;
    } else if (type === 'rack') {
      const w = modelSize.x * 0.25;
      const d = modelSize.z * 0.15;
      geo = new THREE.BoxGeometry(w, 0.02, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        modelCenter.x,
        modelCenter.y + modelSize.y * 0.35,
        modelCenter.z - modelSize.z * 0.2
      );
      mesh.castShadow = true;

      // Add rack supports
      const supportGeo = new THREE.CylinderGeometry(0.015, 0.015, modelSize.y * 0.15, 8);
      const support1 = new THREE.Mesh(supportGeo, mat);
      support1.position.set(w * 0.35, -modelSize.y * 0.075, d * 0.35);
      mesh.add(support1);
      const support2 = new THREE.Mesh(supportGeo, mat);
      support2.position.set(-w * 0.35, -modelSize.y * 0.075, d * 0.35);
      mesh.add(support2);
      const support3 = new THREE.Mesh(supportGeo, mat);
      support3.position.set(w * 0.35, -modelSize.y * 0.075, -d * 0.35);
      mesh.add(support3);
      const support4 = new THREE.Mesh(supportGeo, mat);
      support4.position.set(-w * 0.35, -modelSize.y * 0.075, -d * 0.35);
      mesh.add(support4);

      scene.add(mesh);
      accessories.rack = mesh;
    } else if (type === 'protection') {
      const w = modelSize.x * 0.45;
      const d = modelSize.z * 0.5;
      geo = new THREE.BoxGeometry(w, 0.03, d);
      mat.color.set(0x3a3a3a);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        modelCenter.x,
        modelBox.min.y + 0.01,
        modelCenter.z
      );

      if (config.id === 'full') {
        const guardGeo = new THREE.BoxGeometry(0.03, modelSize.y * 0.1, d * 0.7);
        const guardL = new THREE.Mesh(guardGeo, mat.clone());
        guardL.position.set(w * 0.5, modelSize.y * 0.05, 0);
        mesh.add(guardL);
        const guardR = new THREE.Mesh(guardGeo, mat.clone());
        guardR.position.set(-w * 0.5, modelSize.y * 0.05, 0);
        mesh.add(guardR);
      }

      mesh.castShadow = true;
      scene.add(mesh);
      accessories.protection = mesh;
    }
  }

  // ─── Apply Functions ───
  function applyColor(colorConfig) {
    state.color = colorConfig;
    const targetColor = new THREE.Color(colorConfig.color);

    bodyMeshes.forEach((mesh) => {
      if (mesh.material) {
        // Animate color transition
        const fromColor = mesh.material.color.clone();
        const fromMetalness = mesh.material.metalness;
        const fromRoughness = mesh.material.roughness;
        const start = performance.now();
        const duration = 400;

        function animateMaterial() {
          const t = Math.min((performance.now() - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);

          mesh.material.color.lerpColors(fromColor, targetColor, ease);
          mesh.material.metalness = fromMetalness + (colorConfig.metalness - fromMetalness) * ease;
          mesh.material.roughness = fromRoughness + (colorConfig.roughness - fromRoughness) * ease;
          mesh.material.needsUpdate = true;

          if (t < 1) requestAnimationFrame(animateMaterial);
        }
        animateMaterial();
      }
    });
  }

  function applyWheels(wheelConfig) {
    state.wheels = wheelConfig;
    wheelMeshes.forEach((mesh) => {
      const fromScale = mesh.scale.x;
      const toScale = wheelConfig.scale;
      const start = performance.now();
      const duration = 500;

      function animateWheel() {
        const t = Math.min((performance.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const s = fromScale + (toScale - fromScale) * ease;
        mesh.scale.setScalar(s);
        if (t < 1) requestAnimationFrame(animateWheel);
      }
      animateWheel();
    });
  }

  function applySuspension(suspConfig) {
    state.suspension = suspConfig;
    const fromY = model.position.y;
    const toY = suspConfig.heightOffset;
    const start = performance.now();
    const duration = 600;

    function animateSuspension() {
      const t = Math.min((performance.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      model.position.y = fromY + (toY - fromY) * ease;
      if (t < 1) requestAnimationFrame(animateSuspension);
    }
    animateSuspension();
  }

  function applyCargo(cargoConfig) {
    state.cargo = cargoConfig;
    createAccessoryMesh('cargo', cargoConfig);
  }

  function applyRack(rackConfig) {
    state.rack = rackConfig;
    createAccessoryMesh('rack', rackConfig);
  }

  function applyProtection(protConfig) {
    state.protection = protConfig;
    createAccessoryMesh('protection', protConfig);
  }

  function getTotalPrice() {
    return BASE_PRICE
      + state.color.price
      + state.wheels.price
      + state.suspension.price
      + state.cargo.price
      + state.rack.price
      + state.protection.price;
  }

  function getState() {
    return { ...state };
  }

  // ─── Auto-Configure Presets ───
  const PRESETS = {
    sport: {
      name: 'Sport',
      desc: 'Performance riding & trail racing',
      color: CONFIG.colors.find(c => c.id === 'mars-red'),
      wheels: CONFIG.wheels.find(w => w.id === 'performance'),
      suspension: CONFIG.suspension.find(s => s.id === 'performance'),
      cargo: CONFIG.cargo.find(c => c.id === 'none'),
      rack: CONFIG.rack.find(r => r.id === 'sport'),
      protection: CONFIG.protection.find(p => p.id === 'skid'),
      rationale: [
        { feature: 'Performance Suspension', reason: 'Lowered ride height sharpens cornering and responsiveness on trails.' },
        { feature: 'Performance 19" Wheels', reason: 'Track-focused grip transfers more power to the ground at speed.' },
        { feature: 'Skid Plates', reason: 'Lightweight underbody armor protects without adding unnecessary weight.' },
        { feature: 'Sport Rack', reason: 'Aerodynamic low-profile rack keeps drag minimal at high speed.' },
      ],
      specs: {
        range: '45 mi',
        topSpeed: '65 mph',
        accel: '3.2 sec',
        payload: '—',
        groundClearance: '8"',
      },
    },
    farm: {
      name: 'Farm',
      desc: 'Built for rugged agricultural work',
      color: CONFIG.colors.find(c => c.id === 'raw-steel'),
      wheels: CONFIG.wheels.find(w => w.id === 'offroad'),
      suspension: CONFIG.suspension.find(s => s.id === 'offroad'),
      cargo: CONFIG.cargo.find(c => c.id === 'extended'),
      rack: CONFIG.rack.find(r => r.id === 'utility'),
      protection: CONFIG.protection.find(p => p.id === 'full'),
      rationale: [
        { feature: 'Off-Road Suspension', reason: 'Raised long-travel suspension clears ditches, rows, and uneven terrain.' },
        { feature: 'Off-Road 22" Wheels', reason: 'Wide treads provide maximum traction on wet, muddy ground.' },
        { feature: 'Extended Cargo', reason: '40L modular system carries tools, seeds, or supplies across the property.' },
        { feature: 'Utility Rack', reason: 'Heavy-duty load bearing rack handles fencing equipment and large gear.' },
        { feature: 'Full Guard', reason: 'Complete protection from rocks, stumps, and debris under the chassis.' },
      ],
      specs: {
        range: '38 mi',
        topSpeed: '45 mph',
        accel: '4.8 sec',
        payload: '110 lbs',
        groundClearance: '14"',
      },
    },
    hunting: {
      name: 'Hunting',
      desc: 'Silent & stealthy for the outdoors',
      color: CONFIG.colors.find(c => c.id === 'dark-steel'),
      wheels: CONFIG.wheels.find(w => w.id === 'offroad'),
      suspension: CONFIG.suspension.find(s => s.id === 'offroad'),
      cargo: CONFIG.cargo.find(c => c.id === 'rear'),
      rack: CONFIG.rack.find(r => r.id === 'utility'),
      protection: CONFIG.protection.find(p => p.id === 'full'),
      rationale: [
        { feature: 'Dark Stainless Color', reason: 'Low-visibility matte finish blends into natural surroundings.' },
        { feature: 'Off-Road Suspension', reason: 'Raised clearance navigates brush, creek crossings, and rough terrain silently.' },
        { feature: 'Off-Road 22" Wheels', reason: 'Wide tires absorb terrain noise and grip loose ground without spinning.' },
        { feature: 'Rear Storage', reason: '15L sealed compartment keeps gear dry and secured during transport.' },
        { feature: 'Full Guard', reason: 'Protects the undercarriage from rocks, logs, and creek beds.' },
      ],
      specs: {
        range: '40 mi',
        topSpeed: '50 mph',
        accel: '4.2 sec',
        payload: '85 lbs',
        groundClearance: '14"',
      },
    },
  };

  function applyPreset(presetId, onStepComplete) {
    const preset = PRESETS[presetId];
    if (!preset) return;

    const steps = [
      () => { applyColor(preset.color); onStepComplete?.('color', preset.color); },
      () => { applyWheels(preset.wheels); onStepComplete?.('wheels', preset.wheels); },
      () => { applySuspension(preset.suspension); onStepComplete?.('suspension', preset.suspension); },
      () => { applyCargo(preset.cargo); onStepComplete?.('cargo', preset.cargo); },
      () => { applyRack(preset.rack); onStepComplete?.('rack', preset.rack); },
      () => { applyProtection(preset.protection); onStepComplete?.('protection', preset.protection); },
    ];

    // Apply sequentially with delays for visual drama
    steps.forEach((step, i) => {
      setTimeout(step, i * 250);
    });
  }

  return {
    applyColor,
    applyWheels,
    applySuspension,
    applyCargo,
    applyRack,
    applyProtection,
    applyPreset,
    getTotalPrice,
    getState,
    CONFIG,
    BASE_PRICE,
    PRESETS,
  };
}
