function createModel(THREE, kit) {
  const root = new THREE.Group();
  root.name = 'cybercab-robotaxi-root';

  const RoundedBoxGeometry =
    (kit && kit.RoundedBoxGeometry) ||
    function (w, h, d, segs, r) {
      return new THREE.BoxGeometry(w, h, d, segs || 2, segs || 2, segs || 2);
    };

  // =========================================================================
  // 1. MATERIALS (MeshPhysicalMaterial - Metallic Gold-Silver, Trim & Cabin)
  // =========================================================================
  const mats = {
    cyberGoldSilver: new THREE.MeshPhysicalMaterial({
      name: 'cybercab-liquid-silver-gold',
      color: new THREE.Color('#d5d2c8'),
      metalness: 1.0,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.14,
      side: THREE.DoubleSide
    }),
    cyberSteelMid: new THREE.MeshPhysicalMaterial({
      name: 'cybercab-anodized-mid',
      color: new THREE.Color('#8e9699'),
      metalness: 1.0,
      roughness: 0.3,
      clearcoat: 0.35,
      clearcoatRoughness: 0.22,
      side: THREE.DoubleSide
    }),
    trimSlate: new THREE.MeshPhysicalMaterial({
      name: 'trim-slate',
      color: new THREE.Color('#343c3e'),
      metalness: 0.3,
      roughness: 0.42,
      clearcoat: 0.3,
      side: THREE.DoubleSide
    }),
    trimCharcoal: new THREE.MeshPhysicalMaterial({
      name: 'trim-charcoal-matte',
      color: new THREE.Color('#1b2325'),
      metalness: 0.15,
      roughness: 0.8,
      side: THREE.DoubleSide
    }),
    rubberBlack: new THREE.MeshPhysicalMaterial({
      name: 'rubber-matte-black',
      color: new THREE.Color('#060b0b'),
      metalness: 0.05,
      roughness: 0.82,
      side: THREE.DoubleSide
    }),
    glossBlack: new THREE.MeshPhysicalMaterial({
      name: 'gloss-piano-black',
      color: new THREE.Color('#060b0b'),
      metalness: 0.1,
      roughness: 0.28,
      clearcoat: 0.6,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide
    }),
    cabinIvoryLeather: new THREE.MeshPhysicalMaterial({
      name: 'vegan-leather-ivory',
      color: new THREE.Color('#d8ddde'),
      metalness: 0.02,
      roughness: 0.68,
      clearcoat: 0.1,
      side: THREE.DoubleSide
    }),
    cabinAlcantara: new THREE.MeshPhysicalMaterial({
      name: 'cabin-alcantara-slate',
      color: new THREE.Color('#465c5e'),
      metalness: 0.05,
      roughness: 0.82,
      side: THREE.DoubleSide
    }),
    cabinCarpet: new THREE.MeshPhysicalMaterial({
      name: 'cabin-floor-carpet',
      color: new THREE.Color('#141a1c'),
      metalness: 0.0,
      roughness: 0.88,
      side: THREE.DoubleSide
    }),
    armorGlass: new THREE.MeshPhysicalMaterial({
      name: 'canopy-glass',
      color: new THREE.Color('#779496'),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 1.0,
      thickness: 0.5,
      ior: 1.52,
      clearcoat: 0.6,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    }),
    clearLens: new THREE.MeshPhysicalMaterial({
      name: 'lightbar-lens',
      color: new THREE.Color('#ccd7d8'),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 1.0,
      thickness: 0.5,
      ior: 1.49,
      clearcoat: 0.6,
      transparent: true
    }),
    frontLed: new THREE.MeshPhysicalMaterial({
      name: 'front-led-pickup-glow',
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#e6f9ff'),
      emissiveIntensity: 3.2,
      roughness: 0.15,
      clearcoat: 0.6
    }),
    rearLed: new THREE.MeshPhysicalMaterial({
      name: 'rear-led-blade-red',
      color: new THREE.Color('#ff2020'),
      emissive: new THREE.Color('#ff1410'),
      emissiveIntensity: 3.6,
      roughness: 0.15,
      clearcoat: 0.6
    }),
    ambientLed: new THREE.MeshPhysicalMaterial({
      name: 'cabin-ambient-lighting',
      color: new THREE.Color('#d8f8ff'),
      emissive: new THREE.Color('#77d8ff'),
      emissiveIntensity: 1.6,
      roughness: 0.2
    }),
    screenUi: new THREE.MeshPhysicalMaterial({
      name: 'center-21in-display-ui',
      color: new THREE.Color('#1b2325'),
      emissive: new THREE.Color('#527a82'),
      emissiveIntensity: 1.15,
      roughness: 0.18,
      clearcoat: 0.6
    }),
    copperInductive: new THREE.MeshPhysicalMaterial({
      name: 'inductive-pad-trim',
      color: new THREE.Color('#8c6246'),
      metalness: 0.9,
      roughness: 0.35
    })
  };

  // =========================================================================
  // 2. CYBERCAB PROPORTIONAL ENVELOPE & COORDINATE FUNCTIONS
  // =========================================================================
  // Official specs: Width = 1.754 m (half-width = 0.877 m), Height = 1.408 m,
  // Ground Clearance = 0.144 m, Step-in Height = 0.414 m, Length = 4.380 m (z: -2.19 to +2.19)
  // Front Axle: z = +1.36 m (215/60R18, R = 0.3575 m, arch radius = 0.398 m)
  // Rear Axle:  z = -1.36 m (225/60R21, R = 0.4020 m, arch radius = 0.442 m)

  const FRONT_AXLE_Z = 1.36;
  const FRONT_R_TIRE = 0.3575;
  const FRONT_R_ARCH = 0.398;

  const REAR_AXLE_Z = -1.36;
  const REAR_R_TIRE = 0.4020;
  const REAR_R_ARCH = 0.442;

  function getBeltY(z) {
    const t = Math.max(0, Math.min(1, (2.16 - z) / 4.32));
    return 0.765 + 0.270 * Math.pow(t, 0.92);
  }

  function getRoofY(z) {
    if (z >= 1.55) {
      const t = (2.16 - z) / (2.16 - 1.55);
      return 0.765 + (0.935 - 0.765) * Math.pow(Math.max(0, t), 0.88);
    } else if (z >= 0.10) {
      const t = (1.55 - z) / (1.55 - 0.10);
      const ease = t * t * (3 - 2 * t);
      return 0.935 + (1.408 - 0.935) * Math.pow(ease, 0.82);
    } else {
      const t = (0.10 - z) / (0.10 - -2.14);
      return 1.408 - (1.408 - 1.035) * Math.pow(Math.max(0, Math.min(1, t)), 1.35);
    }
  }

  function getBeltX(z) {
    const norm = z / 2.16;
    let base = 0.862 - 0.125 * Math.pow(Math.abs(norm), 2.1);
    if (z < -0.5) {
      base -= 0.048 * Math.pow((-0.5 - z) / 1.66, 1.5);
    }
    const fHaunch = 0.015 * Math.exp(-Math.pow((z - FRONT_AXLE_Z) / 0.48, 2));
    const rHaunch = 0.018 * Math.exp(-Math.pow((z - REAR_AXLE_Z) / 0.52, 2));
    return Math.min(0.877, base + fHaunch + rHaunch);
  }

  function getRoofX(z) {
    if (z >= 1.55) {
      const t = (z - 1.55) / (2.16 - 1.55);
      return 0.685 + (0.745 - 0.685) * t;
    } else if (z >= 0.10) {
      const t = (1.55 - z) / (1.55 - 0.10);
      return 0.685 - (0.685 - 0.575) * Math.sin(t * Math.PI * 0.5);
    } else {
      const t = (0.10 - z) / (0.10 - -2.14);
      return 0.575 + (0.640 - 0.575) * Math.pow(t, 1.2);
    }
  }

  function getSillX(z) {
    return getBeltX(z) - 0.062;
  }

  // True circular wheel-arch cutout function with smooth transition down to the 0.185 m lower sill
  function computeWheelArchY(z, zCenter, yAxle, rArch, sillY) {
    const dz = Math.abs(z - zCenter);
    const outerSpan = rArch + 0.035;
    if (dz >= outerSpan) return sillY;
    if (dz <= rArch * 0.94) {
      return yAxle + Math.sqrt(Math.max(0, rArch * rArch - dz * dz));
    }
    // Smoothly blend the lower lip of the circle down to sillY between 0.94*rArch and rArch+0.035
    const yAtJoin = yAxle + Math.sqrt(Math.max(0, rArch * rArch - Math.pow(rArch * 0.94, 2)));
    const u = (dz - rArch * 0.94) / (outerSpan - rArch * 0.94);
    const smooth = u * u * (3 - 2 * u);
    return yAtJoin * (1 - smooth) + sillY * smooth;
  }

  function getLowerArchY(z) {
    if (z > 0.5) {
      const baseSill = z > 1.80 ? 0.185 + ((z - 1.80) / 0.36) * 0.035 : 0.185;
      return computeWheelArchY(z, FRONT_AXLE_Z, FRONT_R_TIRE, FRONT_R_ARCH, baseSill);
    }
    if (z < -0.5) {
      const baseSill = z < -1.84 ? 0.185 + ((-1.84 - z) / 0.32) * 0.045 : 0.185;
      return computeWheelArchY(z, REAR_AXLE_Z, REAR_R_TIRE, REAR_R_ARCH, baseSill);
    }
    return 0.185;
  }

  function getBodySideX(z, y) {
    const yBelt = getBeltY(z);
    const xBelt = getBeltX(z);
    const xSill = getSillX(z);
    const t = Math.max(0, Math.min(1, (y - 0.185) / Math.max(0.05, yBelt - 0.185)));
    return xSill + (xBelt - xSill) * t;
  }

  // Helper: Builds a smooth beveled quad strip between two 3D polylines
  function createBeveledStrip(lineA, lineB, bevelSteps, material, name) {
    const steps = bevelSteps || 4;
    const n = lineA.length;
    const positions = [];
    const indices = [];

    for (let i = 0; i < n; i++) {
      const pA = lineA[i];
      const pB = lineB[i];
      for (let s = 0; s <= steps; s++) {
        let u = s / steps;
        if (steps === 4) {
          const map = [0.0, 0.035, 0.5, 0.965, 1.0];
          u = map[s];
        }
        positions.push(
          pA.x + (pB.x - pA.x) * u,
          pA.y + (pB.y - pA.y) * u,
          pA.z + (pB.z - pA.z) * u
        );
      }
    }

    const rowVerts = steps + 1;
    for (let i = 0; i < n - 1; i++) {
      for (let s = 0; s < steps; s++) {
        const a = i * rowVerts + s;
        const b = (i + 1) * rowVerts + s;
        const c = (i + 1) * rowVerts + (s + 1);
        const d = i * rowVerts + (s + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = name;
    return mesh;
  }

  // =========================================================================
  // 3. FIXED BODY SHELL (High-Res Wheel Arches, Quarters, Roof Spine, Sills)
  // =========================================================================
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'cybercab-fixed-body-group';
  root.add(bodyGroup);

  // High-density longitudinal stations around front and rear wheel arches so cutouts are perfectly round
  const zFrontBody = [2.14, 2.04, 1.94, 1.85, 1.81];
  for (let i = 0; i <= 24; i++) {
    zFrontBody.push(1.79 - (i / 24) * (1.79 - 0.93));
  }
  zFrontBody.push(0.91, 0.88, 0.86);

  const zDoorSpan = [0.86, 0.65, 0.40, 0.15, -0.10, -0.35, -0.52, -0.68];

  const zRearBody = [-0.68, -0.75, -0.85, -0.89];
  for (let i = 0; i <= 24; i++) {
    zRearBody.push(-0.91 - (i / 24) * (1.81 - 0.91));
  }
  zRearBody.push(-1.83, -1.90, -2.02, -2.14);

  // Helper: Builds a sculpted, top-centered 3D Fender Arch Guard Lip + Recessed Inner Splash Liner
  function createWheelGuardAssembly(side, isRear) {
    const sign = side === 'left' ? 1 : -1;
    const zCenter = isRear ? REAR_AXLE_Z : FRONT_AXLE_Z;
    const yAxle = isRear ? REAR_R_TIRE : FRONT_R_TIRE;
    const rArch = isRear ? REAR_R_ARCH : FRONT_R_ARCH;
    const label = `${isRear ? 'rear' : 'front'}-${side}`;

    const guardGroup = new THREE.Group();
    guardGroup.name = `wheel-guard-assembly-${label}`;

    const outerEdgeLine = [];
    const lipCreaseLine = [];
    const lipInnerLine = [];
    const wellDeepLine = [];
    const backWallCenterLine = [];

    // Sweep polar angle around top of tire: theta = 0 is TOP DEAD CENTER (+Y)
    // Sweeps from +z (front lower sill edge) over the top (+y) to -z (rear lower sill edge)
    const archSegments = 36;
    const maxAngle = 1.82; // ~104 deg each side from top dead center, ending right at y = 0.185 m

    for (let i = 0; i <= archSegments; i++) {
      const u = (i / archSegments) * 2 - 1; // -1 (front of arch) to +1 (rear of arch)
      const theta = u * maxAngle;

      const z = zCenter - Math.sin(theta) * rArch;
      const yOuter = Math.max(0.185, yAxle + Math.cos(theta) * rArch);

      // Radius of inner lip edge (26 mm radially inward toward tire)
      const rInnerLip = rArch - 0.026;
      const zLip = zCenter - Math.sin(theta) * rInnerLip;
      const yLip = Math.max(0.185, yAxle + Math.cos(theta) * rInnerLip);

      const xBody = getBodySideX(z, yOuter) * sign;
      // Subtle 8 mm outward flare crest on the arch guard trim
      const xFlare = (getBodySideX(zLip, yLip) + 0.008) * sign;
      // Tuck 35 mm inboard behind the fender lip
      const xLipInboard = (getBodySideX(zLip, yLip) - 0.032) * sign;
      // Deep inner wheelhouse splash wall at |x| = 0.54 m (strictly inside the car)
      const xDeep = 0.54 * sign;

      outerEdgeLine.push(new THREE.Vector3(xBody, yOuter, z));
      lipCreaseLine.push(new THREE.Vector3(xFlare, yLip, zLip));
      lipInnerLine.push(new THREE.Vector3(xLipInboard, yLip, zLip));
      wellDeepLine.push(new THREE.Vector3(xDeep, yLip, zLip));
      backWallCenterLine.push(new THREE.Vector3(xDeep, yAxle, zCenter));
    }

    // 1. Sculpted Matte Charcoal Fender Arch Trim Lip (hugs the circular cutout)
    guardGroup.add(
      createBeveledStrip(outerEdgeLine, lipCreaseLine, 2, mats.trimCharcoal, `wheel-arch-lip-outer-${label}`)
    );
    guardGroup.add(
      createBeveledStrip(lipCreaseLine, lipInnerLine, 2, mats.trimCharcoal, `wheel-arch-lip-return-${label}`)
    );

    // 2. Recessed Inner Wheelhouse Splash Shield (strictly inboard between fender lip and chassis)
    guardGroup.add(
      createBeveledStrip(lipInnerLine, wellDeepLine, 2, mats.rubberBlack, `wheel-well-liner-${label}`)
    );
    // Inner wheel-well backing wall at |x| = 0.54 m so you cannot see through the car behind the wheel
    guardGroup.add(
      createBeveledStrip(wellDeepLine, backWallCenterLine, 1, mats.rubberBlack, `wheel-well-backing-${label}`)
    );

    return guardGroup;
  }

  ['left', 'right'].forEach((side) => {
    const sign = side === 'left' ? 1 : -1;

    // 3A. Front Quarter Fender (with 28-point smooth circular wheel arch)
    const fLow = [];
    const fBelt = [];
    const fRoof = [];
    zFrontBody.forEach((z) => {
      const yL = getLowerArchY(z);
      const yB = getBeltY(z);
      const yR = getRoofY(z);
      const xL = getBodySideX(z, yL) * sign;
      const xB = getBeltX(z) * sign;
      fLow.push(new THREE.Vector3(xL, yL, z));
      fBelt.push(new THREE.Vector3(xB, yB, z));
      fRoof.push(new THREE.Vector3(getRoofX(z) * sign, yR, z));
    });
    bodyGroup.add(createBeveledStrip(fLow, fBelt, 4, mats.cyberGoldSilver, `fender-front-lower-${side}`));
    bodyGroup.add(createBeveledStrip(fBelt, fRoof, 4, mats.cyberGoldSilver, `fender-front-upper-${side}`));

    // 3B. Lower Step-In Rocker Sill below the Butterfly Door Aperture (z = +0.86 to -0.68)
    const sBot = [];
    const sStepOuter = [];
    const sStepInner = [];
    const sFloorEdge = [];
    zDoorSpan.forEach((z) => {
      const xOuter = (getBeltX(z) - 0.032) * sign;
      const xSillBot = getSillX(z) * sign;
      const xInner = 0.665 * sign;
      sBot.push(new THREE.Vector3(xSillBot, 0.185, z));
      sStepOuter.push(new THREE.Vector3(xOuter, 0.414, z));
      sStepInner.push(new THREE.Vector3(xInner, 0.414, z));
      sFloorEdge.push(new THREE.Vector3(xInner, 0.255, z));
    });
    bodyGroup.add(createBeveledStrip(sBot, sStepOuter, 3, mats.trimCharcoal, `rocker-sill-outer-${side}`));
    bodyGroup.add(createBeveledStrip(sStepOuter, sStepInner, 3, mats.trimSlate, `door-step-in-threshold-${side}`));
    bodyGroup.add(createBeveledStrip(sStepInner, sFloorEdge, 2, mats.trimCharcoal, `door-sill-inner-riser-${side}`));

    // Scuff plate on the 414 mm step-in sill
    const scuffGeo = new RoundedBoxGeometry(0.065, 0.006, 0.78, 2, 0.002);
    const scuffPlate = new THREE.Mesh(scuffGeo, mats.cyberSteelMid);
    scuffPlate.name = `sill-scuff-plate-${side}`;
    scuffPlate.position.set(0.755 * sign, 0.416, 0.10);
    bodyGroup.add(scuffPlate);

    // 3C. Rear Quarter Panel & Blind Fastback Sail Buttress (with 28-point circular wheel arch)
    const rLow = [];
    const rBelt = [];
    const rRoof = [];
    zRearBody.forEach((z) => {
      const yL = getLowerArchY(z);
      const yB = getBeltY(z);
      const yR = getRoofY(z);
      const xL = getBodySideX(z, yL) * sign;
      const xB = getBeltX(z) * sign;
      rLow.push(new THREE.Vector3(xL, yL, z));
      rBelt.push(new THREE.Vector3(xB, yB, z));
      rRoof.push(new THREE.Vector3(getRoofX(z) * sign, yR, z));
    });
    bodyGroup.add(createBeveledStrip(rLow, rBelt, 4, mats.cyberGoldSilver, `quarter-rear-lower-${side}`));
    bodyGroup.add(createBeveledStrip(rBelt, rRoof, 4, mats.cyberGoldSilver, `quarter-rear-sail-${side}`));

    // 3D. Proper Top-Centered Wheel Arch Guards & Recessed Splash Liners (Front & Rear)
    bodyGroup.add(createWheelGuardAssembly(side, false));
    bodyGroup.add(createWheelGuardAssembly(side, true));

    // 3E. Front A-Pillar & Door Jamb Weatherstrip Frame (at z = +0.86 and z = -0.68)
    const aPillarOuter = [];
    const aPillarInner = [];
    [1.55, 1.32, 1.08, 0.86, 0.45, 0.10].forEach((z) => {
      const xR = getRoofX(z) * sign;
      const yR = getRoofY(z);
      aPillarOuter.push(new THREE.Vector3(xR, yR, z));
      aPillarInner.push(new THREE.Vector3(xR - 0.048 * sign, yR - 0.018, z));
    });
    bodyGroup.add(createBeveledStrip(aPillarOuter, aPillarInner, 3, mats.cyberGoldSilver, `cantrail-roof-arch-${side}`));

    const bJambOuter = [
      new THREE.Vector3((getBeltX(-0.68) - 0.032) * sign, 0.414, -0.68),
      new THREE.Vector3(getBeltX(-0.68) * sign, getBeltY(-0.68), -0.68),
      new THREE.Vector3(getRoofX(-0.68) * sign, getRoofY(-0.68), -0.68)
    ];
    const bJambInner = [
      new THREE.Vector3(0.665 * sign, 0.414, -0.68),
      new THREE.Vector3(0.665 * sign, getBeltY(-0.68) - 0.02, -0.68),
      new THREE.Vector3((getRoofX(-0.68) - 0.055) * sign, getRoofY(-0.68) - 0.03, -0.68)
    ];
    bodyGroup.add(createBeveledStrip(bJambOuter, bJambInner, 3, mats.trimSlate, `b-pillar-door-jamb-${side}`));

    const aJambOuter = [
      new THREE.Vector3((getBeltX(0.86) - 0.032) * sign, 0.414, 0.86),
      new THREE.Vector3(getBeltX(0.86) * sign, getBeltY(0.86), 0.86),
      new THREE.Vector3(getRoofX(0.86) * sign, getRoofY(0.86), 0.86)
    ];
    const aJambInner = [
      new THREE.Vector3(0.665 * sign, 0.414, 0.86),
      new THREE.Vector3(0.665 * sign, getBeltY(0.86) - 0.02, 0.86),
      new THREE.Vector3((getRoofX(0.86) - 0.055) * sign, getRoofY(0.86) - 0.02, 0.86)
    ];
    bodyGroup.add(createBeveledStrip(aJambInner, aJambOuter, 3, mats.trimSlate, `a-pillar-door-jamb-${side}`));

    // Autonomous Side Fender Camera Module (AI5 repeater)
    const camPodGeo = new RoundedBoxGeometry(0.022, 0.028, 0.095, 3, 0.006);
    const camPod = new THREE.Mesh(camPodGeo, mats.glossBlack);
    camPod.name = `fsd-repeater-camera-${side}`;
    camPod.position.set((getBeltX(0.96) + 0.004) * sign, getBeltY(0.96) - 0.06, 0.96);
    bodyGroup.add(camPod);
  });

  // =========================================================================
  // 4. SEALED FRONT HOOD, COLOR-CHANGING MATRIX LED LIGHTBAR & FRONT FASCIA
  // =========================================================================
  const frontGroup = new THREE.Group();
  frontGroup.name = 'front-nose-and-lightbar-group';
  bodyGroup.add(frontGroup);

  const zHood = [2.14, 2.02, 1.88, 1.72, 1.55];
  const hoodLeft = [];
  const hoodCenter = [];
  const hoodRight = [];
  zHood.forEach((z, idx) => {
    const xEdge = getRoofX(z) - 0.015;
    const yEdge = getRoofY(z);
    const zCrown = idx === 0 ? z + 0.045 : z + 0.045 * ((z - 1.55) / (2.14 - 1.55));
    hoodLeft.push(new THREE.Vector3(xEdge, yEdge, z));
    hoodCenter.push(new THREE.Vector3(0, yEdge + 0.018, zCrown));
    hoodRight.push(new THREE.Vector3(-xEdge, yEdge, z));
  });
  frontGroup.add(createBeveledStrip(hoodRight, hoodCenter, 4, mats.cyberGoldSilver, 'sealed-hood-right'));
  frontGroup.add(createBeveledStrip(hoodCenter, hoodLeft, 4, mats.cyberGoldSilver, 'sealed-hood-left'));

  const xNoseCols = [-0.745, -0.62, -0.38, -0.15, 0.0, 0.15, 0.38, 0.62, 0.745];
  function getNoseZ(x) {
    const t = Math.abs(x) / 0.745;
    return 2.185 - 0.055 * Math.pow(t, 1.45);
  }
  const noseBot = [];
  const noseMid = [];
  const noseTop = [];
  const splitterBot = [];
  xNoseCols.forEach((x) => {
    const zT = getNoseZ(x);
    splitterBot.push(new THREE.Vector3(x * 0.94, 0.165, zT - 0.045));
    noseBot.push(new THREE.Vector3(x * 0.95, 0.235, zT - 0.032));
    noseMid.push(new THREE.Vector3(x * 0.99, 0.515, zT + 0.012));
    noseTop.push(new THREE.Vector3(x, 0.745, zT));
  });
  frontGroup.add(createBeveledStrip(splitterBot, noseBot, 3, mats.trimCharcoal, 'front-aero-chin-splitter'));
  frontGroup.add(createBeveledStrip(noseBot, noseMid, 4, mats.cyberGoldSilver, 'front-fascia-lower'));
  frontGroup.add(createBeveledStrip(noseMid, noseTop, 4, mats.cyberGoldSilver, 'front-fascia-upper'));

  // Continuous Front LED Lightbar
  const frontBarPts = [
    new THREE.Vector3(-0.785, 0.772, 2.02),
    new THREE.Vector3(-0.745, 0.758, 2.13),
    new THREE.Vector3(-0.42, 0.755, 2.172),
    new THREE.Vector3(0.0, 0.754, 2.192),
    new THREE.Vector3(0.42, 0.755, 2.172),
    new THREE.Vector3(0.745, 0.758, 2.13),
    new THREE.Vector3(0.785, 0.772, 2.02)
  ];
  const frontBarCurve = new THREE.CatmullRomCurve3(frontBarPts);
  const frontBarCoreGeo = new THREE.TubeGeometry(frontBarCurve, 64, 0.011, 16, false);
  const frontBarCore = new THREE.Mesh(frontBarCoreGeo, mats.frontLed);
  frontBarCore.name = 'front-matrix-lightbar-led';
  frontGroup.add(frontBarCore);

  const frontBarLensGeo = new THREE.TubeGeometry(frontBarCurve, 64, 0.016, 18, false);
  const frontBarLens = new THREE.Mesh(frontBarLensGeo, mats.clearLens);
  frontBarLens.name = 'front-matrix-lightbar-lens';
  frontGroup.add(frontBarLens);

  // Recessed Lower Headlight Projectors (Left & Right)
  const projHousingGeo = new RoundedBoxGeometry(0.165, 0.038, 0.05, 3, 0.006);
  const projLensGeo = new RoundedBoxGeometry(0.145, 0.026, 0.018, 3, 0.004);
  ['left', 'right'].forEach((side) => {
    const s = side === 'left' ? 1 : -1;
    const hMesh = new THREE.Mesh(projHousingGeo, mats.rubberBlack);
    hMesh.name = `front-projector-housing-${side}`;
    hMesh.position.set(0.56 * s, 0.285, 2.135);
    hMesh.rotation.y = -0.16 * s;
    frontGroup.add(hMesh);

    const lMesh = new THREE.Mesh(projLensGeo, mats.frontLed);
    lMesh.name = `front-projector-beam-${side}`;
    lMesh.position.set(0.56 * s, 0.285, 2.155);
    lMesh.rotation.y = -0.16 * s;
    frontGroup.add(lMesh);
  });

  // =========================================================================
  // 5. WINDSHIELD, ROOF CANOPY, STARLINK V5 ANTENNA & POWERED REAR HATCH
  // =========================================================================
  const canopyGroup = new THREE.Group();
  canopyGroup.name = 'canopy-and-starlink-group';
  bodyGroup.add(canopyGroup);

  const zWindshield = [1.55, 1.25, 0.92, 0.60, 0.32, 0.05];
  const wsLeft = [];
  const wsRight = [];
  zWindshield.forEach((z) => {
    const xW = getRoofX(z) - 0.042;
    const yW = getRoofY(z) - 0.006;
    wsLeft.push(new THREE.Vector3(xW, yW, z));
    wsRight.push(new THREE.Vector3(-xW, yW, z));
  });
  canopyGroup.add(createBeveledStrip(wsRight, wsLeft, 4, mats.armorGlass, 'panoramic-windshield-glass'));

  const fsdClusterGeo = new RoundedBoxGeometry(0.24, 0.045, 0.16, 3, 0.008);
  const fsdCluster = new THREE.Mesh(fsdClusterGeo, mats.glossBlack);
  fsdCluster.name = 'windshield-fsd-camera-housing';
  fsdCluster.position.set(0, getRoofY(0.82) - 0.032, 0.82);
  fsdCluster.rotation.x = 0.36;
  canopyGroup.add(fsdCluster);

  const starlinkFrameGeo = new RoundedBoxGeometry(0.56, 0.022, 0.42, 4, 0.006);
  const starlinkPanel = new THREE.Mesh(starlinkFrameGeo, mats.glossBlack);
  starlinkPanel.name = 'starlink-v5-roof-antenna';
  starlinkPanel.position.set(0, getRoofY(-0.18) - 0.008, -0.18);
  starlinkPanel.rotation.x = -0.14;
  canopyGroup.add(starlinkPanel);

  // Powered Rear Liftback Hatch (`rear-hatch-pivot`) - Windowless Solid Metallic Decklid
  const rearHatchPivot = new THREE.Group();
  rearHatchPivot.name = 'rear-hatch-pivot';
  rearHatchPivot.position.set(0, getRoofY(-0.42), -0.42);
  bodyGroup.add(rearHatchPivot);

  const zHatch = [-0.42, -0.75, -1.10, -1.45, -1.80, -2.05, -2.14];
  const hatchLeft = [];
  const hatchCenter = [];
  const hatchRight = [];
  zHatch.forEach((z) => {
    const xH = getRoofX(z) - 0.025;
    const yH = getRoofY(z) - getRoofY(-0.42);
    const zRel = z - -0.42;
    hatchLeft.push(new THREE.Vector3(xH, yH, zRel));
    hatchCenter.push(new THREE.Vector3(0, yH + 0.014, zRel));
    hatchRight.push(new THREE.Vector3(-xH, yH, zRel));
  });
  rearHatchPivot.add(
    createBeveledStrip(hatchRight, hatchCenter, 4, mats.cyberGoldSilver, 'windowless-rear-hatch-right')
  );
  rearHatchPivot.add(
    createBeveledStrip(hatchCenter, hatchLeft, 4, mats.cyberGoldSilver, 'windowless-rear-hatch-left')
  );

  const rearBladeHousingGeo = new RoundedBoxGeometry(1.32, 0.044, 0.036, 3, 0.006);
  const rearBladeHousing = new THREE.Mesh(rearBladeHousingGeo, mats.rubberBlack);
  rearBladeHousing.name = 'rear-lightbar-housing';
  rearBladeHousing.position.set(0, getRoofY(-2.14) - getRoofY(-0.42) - 0.02, -2.14 - -0.42);
  rearHatchPivot.add(rearBladeHousing);

  const rearBladeLedGeo = new RoundedBoxGeometry(1.28, 0.026, 0.022, 3, 0.005);
  const rearBladeLed = new THREE.Mesh(rearBladeLedGeo, mats.rearLed);
  rearBladeLed.name = 'rear-solid-red-lightbar';
  rearBladeLed.position.set(0, getRoofY(-2.14) - getRoofY(-0.42) - 0.02, -2.152 - -0.42);
  rearHatchPivot.add(rearBladeLed);

  // Contoured Rear Lower Fascia & Integrated Flush Aero Diffuser
  const rearFasciaCols = [-0.66, -0.48, -0.24, 0.0, 0.24, 0.48, 0.66];
  const rDiffuserBot = rearFasciaCols.map((x) => new THREE.Vector3(x * 0.90, 0.195, -2.08));
  const rFasciaBot = rearFasciaCols.map((x) => new THREE.Vector3(x * 0.94, 0.315, -2.135));
  const rFasciaTop = rearFasciaCols.map((x) => new THREE.Vector3(x, 0.995, -2.15));
  bodyGroup.add(createBeveledStrip(rDiffuserBot, rFasciaBot, 3, mats.trimCharcoal, 'rear-aero-diffuser'));
  bodyGroup.add(createBeveledStrip(rFasciaBot, rFasciaTop, 4, mats.cyberSteelMid, 'rear-lower-fascia-panel'));

  // 6 Aero Diffuser Vertical Fins (InstancedMesh)
  const finGeo = new RoundedBoxGeometry(0.014, 0.095, 0.14, 2, 0.003);
  const diffuserFins = new THREE.InstancedMesh(finGeo, mats.rubberBlack, 6);
  diffuserFins.name = 'rear-diffuser-strakes-instanced';
  const dummy = new THREE.Object3D();
  [-0.48, -0.30, -0.12, 0.12, 0.30, 0.48].forEach((xFin, idx) => {
    dummy.position.set(xFin, 0.245, -2.10);
    dummy.rotation.set(0.22, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    diffuserFins.setMatrixAt(idx, dummy.matrix);
  });
  diffuserFins.instanceMatrix.needsUpdate = true;
  bodyGroup.add(diffuserFins);

  // Underbody Structural Skateboard Floor (144 mm ground clearance) + Wireless Inductive Receiver Pad
  const chassisFloorGeo = new RoundedBoxGeometry(1.36, 0.085, 3.65, 3, 0.02);
  const chassisFloor = new THREE.Mesh(chassisFloorGeo, mats.rubberBlack);
  chassisFloor.name = 'underbody-48kwh-battery-floor';
  chassisFloor.position.set(0, 0.205, 0.0);
  bodyGroup.add(chassisFloor);

  const inductivePadGeo = new RoundedBoxGeometry(0.58, 0.016, 0.64, 3, 0.006);
  const inductivePad = new THREE.Mesh(inductivePadGeo, mats.copperInductive);
  inductivePad.name = 'wireless-inductive-charging-pad';
  inductivePad.position.set(0, 0.155, -0.85);
  bodyGroup.add(inductivePad);

  // =========================================================================
  // 6. ARTICULATED DUAL BUTTERFLY DOORS (`door-left-pivot`, `door-right-pivot`)
  // =========================================================================
  ['left', 'right'].forEach((side) => {
    const sign = side === 'left' ? 1 : -1;
    const pivotPos = new THREE.Vector3(0.745 * sign, 1.075, 0.76);

    const doorPivot = new THREE.Group();
    doorPivot.name = `door-${side}-pivot`;
    doorPivot.position.copy(pivotPos);
    root.add(doorPivot);

    function toDoorLocal(x, y, z) {
      return new THREE.Vector3(x - pivotPos.x, y - pivotPos.y, z - pivotPos.z);
    }

    const dSillLine = [];
    const dBeltLine = [];
    const dInnerSkinBot = [];
    const dInnerSkinTop = [];
    const dWinBot = [];
    const dWinTop = [];

    zDoorSpan.forEach((z) => {
      const xSill = (getBeltX(z) - 0.030) * sign;
      const ySill = 0.418;
      const xBelt = getBeltX(z) * sign;
      const yBelt = getBeltY(z);
      const xRoof = (getRoofX(z) - 0.008) * sign;
      const yRoof = getRoofY(z) - 0.022;

      dSillLine.push(toDoorLocal(xSill, ySill, z));
      dBeltLine.push(toDoorLocal(xBelt, yBelt, z));

      dInnerSkinBot.push(toDoorLocal(xSill - 0.065 * sign, ySill + 0.015, z));
      dInnerSkinTop.push(toDoorLocal(xBelt - 0.072 * sign, yBelt - 0.01, z));

      dWinBot.push(toDoorLocal(xBelt - 0.016 * sign, yBelt - 0.005, z));
      dWinTop.push(toDoorLocal(xRoof - 0.012 * sign, yRoof, z));
    });

    doorPivot.add(
      createBeveledStrip(dSillLine, dBeltLine, 4, mats.cyberGoldSilver, `door-outer-skin-${side}`)
    );
    doorPivot.add(
      createBeveledStrip(dSillLine, dInnerSkinBot, 2, mats.trimCharcoal, `door-bottom-edge-seal-${side}`)
    );
    doorPivot.add(
      createBeveledStrip(dInnerSkinBot, dInnerSkinTop, 3, mats.trimSlate, `door-inner-shell-${side}`)
    );
    doorPivot.add(
      createBeveledStrip(dBeltLine, dInnerSkinTop, 2, mats.trimCharcoal, `door-window-belt-seal-${side}`)
    );
    doorPivot.add(
      createBeveledStrip(dWinBot, dWinTop, 3, mats.armorGlass, `door-window-glass-${side}`)
    );

    const frontShutOuter = [dSillLine[0], dBeltLine[0]];
    const frontShutInner = [dInnerSkinBot[0], dInnerSkinTop[0]];
    doorPivot.add(
      createBeveledStrip(frontShutOuter, frontShutInner, 2, mats.trimCharcoal, `door-shutface-front-${side}`)
    );
    const rearShutOuter = [dSillLine[dSillLine.length - 1], dBeltLine[dSillLine.length - 1]];
    const rearShutInner = [dInnerSkinBot[dInnerSkinBot.length - 1], dInnerSkinTop[dInnerSkinTop.length - 1]];
    doorPivot.add(
      createBeveledStrip(rearShutOuter, rearShutInner, 2, mats.trimCharcoal, `door-shutface-rear-${side}`)
    );

    // Interior Door Trim Card, Armrest, Ambient Light Strip & Emergency Release
    const armrestBolsterGeo = new RoundedBoxGeometry(0.068, 0.095, 0.88, 3, 0.018);
    const armrestBolster = new THREE.Mesh(armrestBolsterGeo, mats.cabinIvoryLeather);
    armrestBolster.name = `door-interior-armrest-${side}`;
    armrestBolster.position.copy(toDoorLocal(0.745 * sign, 0.71, 0.08));
    doorPivot.add(armrestBolster);

    const pullHandleGeo = new RoundedBoxGeometry(0.032, 0.045, 0.24, 3, 0.008);
    const pullHandle = new THREE.Mesh(pullHandleGeo, mats.trimCharcoal);
    pullHandle.name = `door-interior-grab-handle-${side}`;
    pullHandle.position.copy(toDoorLocal(0.715 * sign, 0.735, 0.22));
    doorPivot.add(pullHandle);

    const mechReleaseGeo = new RoundedBoxGeometry(0.022, 0.014, 0.085, 2, 0.004);
    const mechRelease = new THREE.Mesh(mechReleaseGeo, mats.cyberSteelMid);
    mechRelease.name = `door-emergency-release-lever-${side}`;
    mechRelease.position.copy(toDoorLocal(0.712 * sign, 0.752, 0.34));
    doorPivot.add(mechRelease);

    const doorLedGeo = new RoundedBoxGeometry(0.012, 0.010, 1.18, 2, 0.003);
    const doorLed = new THREE.Mesh(doorLedGeo, mats.ambientLed);
    doorLed.name = `door-ambient-led-strip-${side}`;
    doorLed.position.copy(toDoorLocal(0.748 * sign, 0.815, 0.08));
    doorLed.rotation.x = -0.055;
    doorPivot.add(doorLed);

    const strutGeo = new THREE.CylinderGeometry(0.012, 0.014, 0.34, 24);
    const doorStrut = new THREE.Mesh(strutGeo, mats.cyberSteelMid);
    doorStrut.name = `door-butterfly-gas-strut-${side}`;
    doorStrut.position.copy(toDoorLocal(0.725 * sign, 0.84, 0.68));
    doorStrut.rotation.x = 0.42;
    doorStrut.rotation.z = -0.18 * sign;
    doorPivot.add(doorStrut);
  });

  // =========================================================================
  // 7. FULL 2-PASSENGER AUTONOMOUS LOUNGE INTERIOR & 572 L REAR CARGO TRUNK
  // =========================================================================
  const interiorGroup = new THREE.Group();
  interiorGroup.name = 'cabin-interior-and-trunk-group';
  root.add(interiorGroup);

  const cabinFloorGeo = new RoundedBoxGeometry(1.33, 0.035, 1.92, 3, 0.01);
  const cabinFloor = new THREE.Mesh(cabinFloorGeo, mats.cabinCarpet);
  cabinFloor.name = 'cabin-flat-floor-pan';
  cabinFloor.position.set(0, 0.255, 0.22);
  interiorGroup.add(cabinFloor);

  const toeBoardGeo = new RoundedBoxGeometry(1.28, 0.34, 0.04, 3, 0.01);
  const toeBoard = new THREE.Mesh(toeBoardGeo, mats.cabinCarpet);
  toeBoard.name = 'cabin-pedal-free-footrest-wall';
  toeBoard.position.set(0, 0.38, 1.12);
  toeBoard.rotation.x = -0.52;
  interiorGroup.add(toeBoard);

  const floorMatGeo = new RoundedBoxGeometry(0.52, 0.008, 0.74, 3, 0.004);
  ['left', 'right'].forEach((side) => {
    const s = side === 'left' ? 1 : -1;
    const mat = new THREE.Mesh(floorMatGeo, mats.trimCharcoal);
    mat.name = `cabin-floor-mat-${side}`;
    mat.position.set(0.33 * s, 0.275, 0.52);
    interiorGroup.add(mat);
  });

  // Tiered Autonomous Dashboard (No steering wheel, no pedals, no glove box)
  const dashUpperGeo = new RoundedBoxGeometry(1.32, 0.085, 0.42, 4, 0.022);
  const dashUpper = new THREE.Mesh(dashUpperGeo, mats.cabinAlcantara);
  dashUpper.name = 'dashboard-upper-cowl';
  dashUpper.position.set(0, 0.815, 0.96);
  dashUpper.rotation.x = 0.08;
  interiorGroup.add(dashUpper);

  const dashLowerGeo = new RoundedBoxGeometry(1.30, 0.095, 0.36, 4, 0.025);
  const dashLower = new THREE.Mesh(dashLowerGeo, mats.cabinIvoryLeather);
  dashLower.name = 'dashboard-lower-bolster';
  dashLower.position.set(0, 0.725, 0.90);
  interiorGroup.add(dashLower);

  const airSlotGeo = new RoundedBoxGeometry(1.26, 0.018, 0.04, 2, 0.004);
  const airSlot = new THREE.Mesh(airSlotGeo, mats.rubberBlack);
  airSlot.name = 'dashboard-climate-vent-slot';
  airSlot.position.set(0, 0.772, 0.74);
  interiorGroup.add(airSlot);

  const dashAmbientGeo = new RoundedBoxGeometry(1.24, 0.008, 0.012, 2, 0.003);
  const dashAmbient = new THREE.Mesh(dashAmbientGeo, mats.ambientLed);
  dashAmbient.name = 'dashboard-ambient-lightbar';
  dashAmbient.position.set(0, 0.782, 0.745);
  interiorGroup.add(dashAmbient);

  // 21-Inch Central Touchscreen (510 mm × 295 mm)
  const screenMountGeo = new RoundedBoxGeometry(0.14, 0.11, 0.16, 3, 0.015);
  const screenMount = new THREE.Mesh(screenMountGeo, mats.trimSlate);
  screenMount.name = 'center-touchscreen-mount-arm';
  screenMount.position.set(0, 0.77, 0.72);
  interiorGroup.add(screenMount);

  const screenHousingGeo = new RoundedBoxGeometry(0.51, 0.295, 0.022, 4, 0.012);
  const screenHousing = new THREE.Mesh(screenHousingGeo, mats.cyberSteelMid);
  screenHousing.name = 'center-touchscreen-21in-housing';
  screenHousing.position.set(0, 0.805, 0.635);
  screenHousing.rotation.x = -0.22;
  interiorGroup.add(screenHousing);

  const screenBezelGeo = new RoundedBoxGeometry(0.496, 0.282, 0.008, 3, 0.008);
  const screenBezel = new THREE.Mesh(screenBezelGeo, mats.glossBlack);
  screenBezel.name = 'center-touchscreen-21in-bezel';
  screenBezel.position.set(0, 0.805, 0.623);
  screenBezel.rotation.x = -0.22;
  interiorGroup.add(screenBezel);

  const screenActiveGeo = new RoundedBoxGeometry(0.478, 0.264, 0.004, 2, 0.004);
  const screenActive = new THREE.Mesh(screenActiveGeo, mats.screenUi);
  screenActive.name = 'center-touchscreen-21in-display';
  screenActive.position.set(0, 0.805, 0.618);
  screenActive.rotation.x = -0.22;
  interiorGroup.add(screenActive);

  // Floating Center Console with Dual Cupholders & Wireless Phone Chargers
  const consoleBaseGeo = new RoundedBoxGeometry(0.24, 0.26, 0.86, 4, 0.025);
  const consoleBase = new THREE.Mesh(consoleBaseGeo, mats.trimCharcoal);
  consoleBase.name = 'center-console-base';
  consoleBase.position.set(0, 0.39, 0.12);
  interiorGroup.add(consoleBase);

  const consoleTopPadGeo = new RoundedBoxGeometry(0.25, 0.055, 0.56, 4, 0.018);
  const consoleTopPad = new THREE.Mesh(consoleTopPadGeo, mats.cabinIvoryLeather);
  consoleTopPad.name = 'center-console-armrest-pad';
  consoleTopPad.position.set(0, 0.54, -0.02);
  interiorGroup.add(consoleTopPad);

  const phonePadGeo = new RoundedBoxGeometry(0.21, 0.018, 0.22, 3, 0.006);
  const phonePad = new THREE.Mesh(phonePadGeo, mats.cabinAlcantara);
  phonePad.name = 'console-wireless-phone-charger';
  phonePad.position.set(0, 0.51, 0.42);
  phonePad.rotation.x = 0.32;
  interiorGroup.add(phonePad);

  const cupPts = [
    new THREE.Vector2(0.0, -0.065),
    new THREE.Vector2(0.042, -0.065),
    new THREE.Vector2(0.045, 0.0),
    new THREE.Vector2(0.052, 0.004)
  ];
  const cupholderGeo = new THREE.LatheGeometry(cupPts, 48);
  [-0.058, 0.058].forEach((xCup, idx) => {
    const cup = new THREE.Mesh(cupholderGeo, mats.rubberBlack);
    cup.name = `console-cupholder-${idx + 1}`;
    cup.position.set(xCup, 0.568, 0.22);
    interiorGroup.add(cup);
  });

  // Two Sculpted Autonomous Lounge Seats
  const seatRiserGeo = new RoundedBoxGeometry(0.42, 0.14, 0.44, 3, 0.015);
  const seatCushionGeo = new RoundedBoxGeometry(0.49, 0.105, 0.52, 4, 0.028);
  const seatThighBolsterGeo = new RoundedBoxGeometry(0.075, 0.135, 0.48, 3, 0.022);
  const seatBackGeo = new RoundedBoxGeometry(0.47, 0.62, 0.115, 4, 0.032);
  const seatHeadrestGeo = new RoundedBoxGeometry(0.26, 0.23, 0.095, 4, 0.025);
  const seatShoulderBolsterGeo = new RoundedBoxGeometry(0.08, 0.52, 0.14, 3, 0.024);

  ['left', 'right'].forEach((side) => {
    const s = side === 'left' ? 1 : -1;
    const xSeat = 0.365 * s;
    const zSeat = -0.06;

    const seatGroup = new THREE.Group();
    seatGroup.name = `seat-${side}-assembly`;
    seatGroup.position.set(xSeat, 0.27, zSeat);
    interiorGroup.add(seatGroup);

    const riser = new THREE.Mesh(seatRiserGeo, mats.trimCharcoal);
    riser.name = `seat-pedestal-${side}`;
    riser.position.set(0, 0.07, 0.04);
    seatGroup.add(riser);

    const cushion = new THREE.Mesh(seatCushionGeo, mats.cabinIvoryLeather);
    cushion.name = `seat-cushion-${side}`;
    cushion.position.set(0, 0.185, 0.06);
    cushion.rotation.x = -0.08;
    seatGroup.add(cushion);

    [-1, 1].forEach((bSide) => {
      const thighBolster = new THREE.Mesh(seatThighBolsterGeo, mats.cabinIvoryLeather);
      thighBolster.name = `seat-thigh-bolster-${side}-${bSide > 0 ? 'outer' : 'inner'}`;
      thighBolster.position.set(0.215 * bSide, 0.205, 0.06);
      thighBolster.rotation.x = -0.08;
      seatGroup.add(thighBolster);
    });

    const reclinePivot = new THREE.Group();
    reclinePivot.name = `seat-${side}-recline-pivot`;
    reclinePivot.position.set(0, 0.21, -0.16);
    reclinePivot.rotation.x = -0.28;
    seatGroup.add(reclinePivot);

    const backrest = new THREE.Mesh(seatBackGeo, mats.cabinIvoryLeather);
    backrest.name = `seat-backrest-${side}`;
    backrest.position.set(0, 0.30, 0);
    reclinePivot.add(backrest);

    const backShellGeo = new RoundedBoxGeometry(0.48, 0.64, 0.035, 3, 0.014);
    const backShell = new THREE.Mesh(backShellGeo, mats.trimSlate);
    backShell.name = `seat-back-shell-${side}`;
    backShell.position.set(0, 0.30, -0.055);
    reclinePivot.add(backShell);

    [-1, 1].forEach((bSide) => {
      const latBolster = new THREE.Mesh(seatShoulderBolsterGeo, mats.cabinIvoryLeather);
      latBolster.name = `seat-lateral-bolster-${side}-${bSide > 0 ? 'outer' : 'inner'}`;
      latBolster.position.set(0.205 * bSide, 0.28, 0.025);
      reclinePivot.add(latBolster);
    });

    const headrest = new THREE.Mesh(seatHeadrestGeo, mats.cabinIvoryLeather);
    headrest.name = `seat-integrated-headrest-${side}`;
    headrest.position.set(0, 0.68, 0.02);
    headrest.rotation.x = 0.12;
    reclinePivot.add(headrest);

    const beltPts = [
      new THREE.Vector3(0.61 * s, 1.05, -0.52),
      new THREE.Vector3(xSeat + 0.08 * s, 0.82, -0.22),
      new THREE.Vector3(xSeat - 0.18 * s, 0.48, -0.12)
    ];
    const beltCurve = new THREE.CatmullRomCurve3(beltPts);
    const beltGeo = new THREE.TubeGeometry(beltCurve, 24, 0.012, 8, false);
    const seatBelt = new THREE.Mesh(beltGeo, mats.rubberBlack);
    seatBelt.name = `seatbelt-strap-${side}`;
    interiorGroup.add(seatBelt);
  });

  // Rear Cabin Partition Bulkhead & 572 L Rear Cargo Trunk Tub
  const bulkheadGeo = new RoundedBoxGeometry(1.30, 0.56, 0.06, 3, 0.015);
  const bulkhead = new THREE.Mesh(bulkheadGeo, mats.cabinAlcantara);
  bulkhead.name = 'cabin-rear-bulkhead-divider';
  bulkhead.position.set(0, 0.56, -0.58);
  bulkhead.rotation.x = -0.18;
  interiorGroup.add(bulkhead);

  const trunkFloorGeo = new RoundedBoxGeometry(1.12, 0.03, 1.38, 3, 0.01);
  const trunkFloor = new THREE.Mesh(trunkFloorGeo, mats.cabinCarpet);
  trunkFloor.name = 'rear-trunk-572L-floor';
  trunkFloor.position.set(0, 0.34, -1.32);
  interiorGroup.add(trunkFloor);

  ['left', 'right'].forEach((side) => {
    const s = side === 'left' ? 1 : -1;
    const trunkWallGeo = new RoundedBoxGeometry(0.04, 0.52, 1.34, 3, 0.01);
    const trunkWall = new THREE.Mesh(trunkWallGeo, mats.cabinCarpet);
    trunkWall.name = `rear-trunk-side-liner-${side}`;
    trunkWall.position.set(0.52 * s, 0.58, -1.32);
    interiorGroup.add(trunkWall);
  });

  // =========================================================================
  // 8. STAGGERED SOLID AERO DISC WHEELS (18" Front / 21" Rear)
  // =========================================================================
  function buildAeroWheelGroup(name, rTire, rRim, tireWidth, side, zAxle) {
    const wheelPivot = new THREE.Group();
    wheelPivot.name = name;
    const xCenter = 0.745 * side;
    wheelPivot.position.set(xCenter, rTire, zAxle);

    const halfW = tireWidth * 0.5;

    // 1) Smooth Rounded Tire Carcass via LatheGeometry (56 radial segments >= 48)
    const tirePts = [
      new THREE.Vector2(rRim, -halfW * 0.86),
      new THREE.Vector2(rRim + 0.018, -halfW * 0.96),
      new THREE.Vector2(rTire - 0.035, -halfW),
      new THREE.Vector2(rTire - 0.008, -halfW * 0.82),
      new THREE.Vector2(rTire, -halfW * 0.45),
      new THREE.Vector2(rTire, 0.0),
      new THREE.Vector2(rTire, halfW * 0.45),
      new THREE.Vector2(rTire - 0.008, halfW * 0.82),
      new THREE.Vector2(rTire - 0.035, halfW),
      new THREE.Vector2(rRim + 0.018, halfW * 0.96),
      new THREE.Vector2(rRim, halfW * 0.86)
    ];
    const tireGeo = new THREE.LatheGeometry(tirePts, 56);
    tireGeo.rotateZ(Math.PI * 0.5);
    const tireMesh = new THREE.Mesh(tireGeo, mats.rubberBlack);
    tireMesh.name = `${name}-tire`;
    wheelPivot.add(tireMesh);

    // 2) Signature Cybercab Flush Solid Aero Disc Cover via LatheGeometry (56 segments)
    const discPts = [
      new THREE.Vector2(0.0, halfW * 0.88),
      new THREE.Vector2(0.055, halfW * 0.90),
      new THREE.Vector2(0.062, halfW * 0.85),
      new THREE.Vector2(rRim * 0.58, halfW * 0.87),
      new THREE.Vector2(rRim * 0.62, halfW * 0.83),
      new THREE.Vector2(rRim * 0.86, halfW * 0.88),
      new THREE.Vector2(rRim * 0.90, halfW * 0.84),
      new THREE.Vector2(rRim + 0.008, halfW * 0.89),
      new THREE.Vector2(rRim + 0.008, -halfW * 0.82),
      new THREE.Vector2(0.06, -halfW * 0.75)
    ];
    const discGeo = new THREE.LatheGeometry(discPts, 56);
    discGeo.rotateZ(Math.PI * 0.5);
    const discMesh = new THREE.Mesh(discGeo, mats.trimCharcoal);
    discMesh.name = `${name}-aero-disc-cover`;
    discMesh.scale.x = -side;
    wheelPivot.add(discMesh);

    // 3) Metallic Outer Aero Rim Accent Ring (LatheGeometry, 56 segments)
    const ringPts = [
      new THREE.Vector2(rRim * 0.88, halfW * 0.895),
      new THREE.Vector2(rRim + 0.004, halfW * 0.905),
      new THREE.Vector2(rRim + 0.004, halfW * 0.86),
      new THREE.Vector2(rRim * 0.88, halfW * 0.86)
    ];
    const ringGeo = new THREE.LatheGeometry(ringPts, 56);
    ringGeo.rotateZ(Math.PI * 0.5);
    const ringMesh = new THREE.Mesh(ringGeo, mats.cyberSteelMid);
    ringMesh.name = `${name}-aero-accent-ring`;
    ringMesh.scale.x = -side;
    wheelPivot.add(ringMesh);

    // 4) 10 Radial Aero Turbine Louvers around the outer disc perimeter (InstancedMesh)
    const louverGeo = new RoundedBoxGeometry(0.008, 0.048, 0.016, 2, 0.002);
    const louversInst = new THREE.InstancedMesh(louverGeo, mats.trimSlate, 10);
    louversInst.name = `${name}-aero-louvers-instanced`;
    for (let k = 0; k < 10; k++) {
      const ang = (k / 10) * Math.PI * 2;
      const rLouv = rRim * 0.74;
      dummy.position.set(halfW * 0.89 * side, Math.cos(ang) * rLouv, Math.sin(ang) * rLouv);
      dummy.rotation.set(ang + 0.35, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      louversInst.setMatrixAt(k, dummy.matrix);
    }
    louversInst.instanceMatrix.needsUpdate = true;
    wheelPivot.add(louversInst);

    // 5) Vented Brake Rotor behind the wheel hub
    const rotorGeo = new THREE.CylinderGeometry(rRim * 0.72, rRim * 0.72, 0.026, 48);
    rotorGeo.rotateZ(Math.PI * 0.5);
    const rotorMesh = new THREE.Mesh(rotorGeo, mats.cyberSteelMid);
    rotorMesh.name = `${name}-brake-rotor`;
    rotorMesh.position.x = -0.03 * side;
    wheelPivot.add(rotorMesh);

    return wheelPivot;
  }

  const wheelSpecs = [
    { name: 'wheel-front-left',  rTire: FRONT_R_TIRE, rRim: 0.2286, w: 0.215, side:  1, z: FRONT_AXLE_Z },
    { name: 'wheel-front-right', rTire: FRONT_R_TIRE, rRim: 0.2286, w: 0.215, side: -1, z: FRONT_AXLE_Z },
    { name: 'wheel-rear-left',   rTire: REAR_R_TIRE,  rRim: 0.2667, w: 0.225, side:  1, z: REAR_AXLE_Z },
    { name: 'wheel-rear-right',  rTire: REAR_R_TIRE,  rRim: 0.2667, w: 0.225, side: -1, z: REAR_AXLE_Z }
  ];

  wheelSpecs.forEach((ws) => {
    const wheelGroup = buildAeroWheelGroup(ws.name, ws.rTire, ws.rRim, ws.w, ws.side, ws.z);
    root.add(wheelGroup);
  });

  // =========================================================================
  // 9. BUILT-IN DOOR & HATCH KINEMATIC HELPER FOR ANIMATION
  // =========================================================================
  const leftDoorPivot = root.getObjectByName('door-left-pivot');
  const rightDoorPivot = root.getObjectByName('door-right-pivot');
  const hatchPivot = root.getObjectByName('rear-hatch-pivot');

  root.userData.setDoorOpen = function (leftOpen01, rightOpen01, hatchOpen01) {
    const l = Math.max(0, Math.min(1, leftOpen01 || 0));
    const r = Math.max(0, Math.min(1, rightOpen01 !== undefined ? rightOpen01 : l));
    const h = Math.max(0, Math.min(1, hatchOpen01 || 0));

    if (leftDoorPivot) {
      leftDoorPivot.rotation.set(0.32 * l, 0.42 * l, -1.08 * l);
    }
    if (rightDoorPivot) {
      rightDoorPivot.rotation.set(0.32 * r, -0.42 * r, 1.08 * r);
    }
    if (hatchPivot) {
      hatchPivot.rotation.x = 0.95 * h;
    }
  };

  return root;
}