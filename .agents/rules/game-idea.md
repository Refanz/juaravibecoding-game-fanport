---
trigger: always_on
---

# Project Rules & Coding Standards: IT Support Hospital Game
This document serves as the absolute architectural blueprint and coding standards for the "#JuaraVibeCoding" submission project.

## 1. Tech Stack & Architecture
- **Frontend Framework**: React (Vite bundler) + TypeScript.
- **Game Engine**: Phaser.js (Canvas integrated inside a React component wrapper).
- **Architecture Pattern**: Clean Architecture & Separation of Concerns (SoC).
  - React MUST handle the UI overlay, menus, dialogs, and quiz popups.
  - Phaser MUST handle the core game loop, rendering, physics, and world interactions.
- **Programming Paradigm**: Object-Oriented Programming (OOP) for Phaser logic. Core game entities must be strictly separated into classes: `Player`, `NPC`, and `Interactable`.

## 2. Infrastructure & Deployment
- **Target Platform**: Google Cloud Run.
- **Containerization**: Multi-stage `Dockerfile`.
  - Stage 1: Node.js alpine for building the static assets.
  - Stage 2: `nginx:alpine` to serve static files.
  - Port Configuration: MUST expose and listen on port `8080` (Cloud Run default requirement).

## 3. Asset Management (Vector-to-Raster)
To ensure the project is self-contained without external hosting dependencies:
- **SVG Generation**: All visual assets (sprites, tiles, and objects) must be generated entirely via inline SVG code strings.
- **Preload Rasterization**: SVGs must be converted/rendered into Data URIs (Base64 PNG) ONCE during Phaser's `preload` phase. Do NOT rasterize dynamic SVGs per frame to avoid memory leaks.
- **Visual Style**: Clean, Flat 2D retro design. Avoid heavy drop-shadows or SVG filters that slow down rasterization.
- **Layering & Z-Index**: 
  - Access Points (AP) must be placed on the ceiling layer with the highest Z-index and `60%` opacity, allowing the player sprite to walk underneath them visibly.

## 4. Game Specifications & Map Design
### Game Flow
1. **Welcome Page (React)**: Title "IT Support: Hospital Vibe" with a "Start Game" button.
2. **Main Game Canvas (Phaser)**: Top-down 2D grid/movement.
3. **Floor Transition**: Players move between Floor 1 and Floor 2 using the Elevator (Lift) by pressing the `SPACEBAR`.
4. **Interaction Mechanic**: Faulty IT equipment or PCs must have a blinking visual effect. Approaching them and pressing `SPACEBAR` triggers a React state change to overlay the IT Troubleshooting Quiz popup.

### Hospital Layout
- **Floor 1**: Front Office, Emergency Room (IGD), Pharmacy (Farmasi), ICU, Inpatient Wards (Kelas 1, 2, 3), and Outpatient Clinics (10 General/Specialist Polyclinics).
- **Floor 2**: VIP Inpatient Wards, Operating Rooms (Ruang Operasi), Hemodialysis Unit, and Radiology Department.

### Required Asset List
- Sprites: `Player`, `Medical Staff (NPC)`
- Objects: `Normal PC`, `Broken PC (Blinking)`, `Elevator (Lift)`, `Hospital Bed`, `Medicine Cabinet`, `Radiology Machine`, `Access Point (AP)`