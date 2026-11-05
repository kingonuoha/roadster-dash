# Roadster Dash: Cyber Edition ⚡

A high-performance local replication and expansion of **[Roadster Dash](https://morpii.com/roadsterdash/)**, the 3D Tesla browser-based endless runner game, reverse engineered using **[REA (Reverse Engineer Anything)](https://github.com/morluto/rea)** and expanded with **new playable vehicles**.

---

## ⚡ Quick Start

```bash
# Start the local game server
npm start
```

Then open your browser to **[http://localhost:3001](http://localhost:3001)** (or your configured port).

---

## 🏎️ Playable Vehicles

The game features an interactive vehicle selection system with custom procedural Three.js models:

### 1. 🏎️ Tesla Roadster (Next-Gen Hypercar)
- **Profile**: Curvature-optimized aerodynamic body with active carbon rear wing.
- **Powertrain**: Tri-Motor All-Wheel Drive, 0-60 mph in 1.9s, top speed 250+ mph.
- **Thrusters**: SpaceX cold-gas thruster package with high-pressure air nozzles.

### 2. 📐 Tesla Cybertruck (Cyberbeast)
- **Profile**: Faceted origami cold-rolled 30X stainless steel exoskeleton with triangular apex silhouette.
- **Lighting**: Signature full-width continuous horizontal white LED blade lightbar (front) and red lightbar blade (rear).
- **Armor Glass**: Acoustic polymer-layered tinted armor greenhouse.
- **Bed / Vault**: 6' x 4' vault with motorized tonneau cover slats and active rear aero flap.
- **Wheels**: Heavy all-terrain rugged tires with custom 7-sided polygonal cyber aero wheel covers.
- **Blueprints & Reference**: Includes generated 4-view orthographic reference sheet (`public/images/cybertruck_ref.jpg`).

Switch between vehicles anytime using the **ACTIVE VEHICLE** selector on the main menu, or inspect full 3D specs using the **📐 3D BLUEPRINT** button.

---

## 🎮 Game Controls

| Action | PC Controls | Mobile / Touch |
| :--- | :--- | :--- |
| **Steer / Change Lane** | <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd> | Swipe Left / Right |
| **Jump** | <kbd>↑</kbd> or <kbd>Space</kbd> | Swipe Up |
| **Ground Slam / Fast Fall** | <kbd>↓</kbd> or <kbd>S</kbd> | Swipe Down |
| **Rocket Thruster Boost** | Hold <kbd>Shift</kbd> | Hold `BOOST` button |
| **Use Power-up Item** | <kbd>Z</kbd> | Tap `ITEM` button |
| **Pause** | <kbd>P</kbd> | Pause button |
| **Mute Sound / Music** | <kbd>M</kbd> | Mute button |

---

## 🕹️ Game Features & Mechanics

- **Procedural 3D World (Three.js)**:
  - Zero external GLTF/OBJ model dependencies — both the Roadster and Cybertruck are generated procedurally with dynamic geometry, normals, and materials for instantaneous offline loading.
  - Multi-lane dynamic highway with moving traffic (sedans, trucks, SUVs, barrier ramps).
  - Dynamic lighting, shadows, road blur, and post-processing.
- **Synthesized Audio Engine (Web Audio API)**:
  - Electric motor whine, rocket thrusters, jump swooshes, coin chimes, and crash impacts synthesized entirely in-browser.
- **Tricks & Combat**:
  - Ramp jumps, mid-air barrel rolls, close-call lane dodges, and combo multipliers.
- **Customization Garage (Upgrade)**:
  - Custom paint colors, wheel designs, neon underglow colors, window tint levels, and custom license plates.

