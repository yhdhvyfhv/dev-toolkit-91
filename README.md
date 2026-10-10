# dev-toolkit-91

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

`dev-toolkit-91` is a high-performance TypeScript utility library designed for web-based game engines and interactive canvas applications. It streamlines complex browser game development by providing lightweight, zero-dependency modules for spatial indexing, frame-accurate input buffering, and state interpolation.

## Features

- **Spatial Hash Grid:** $O(1)$ broad-phase collision detection for thousands of dynamic 2D entities.
- **Action-Based Input Mapper:** Unified keyboard, gamepad, and pointer management with customizable frame buffers.
- **State Interpolator:** Fixed-timestep rendering synchronization to eliminate visual jitter across varied refresh rates.
- **Type-Safe Event Bus:** High-throughput publish-subscribe system optimized for core game loop events without garbage collection overhead.

## Installation

Install via your preferred package manager:

```bash
npm install dev-toolkit-91
```

Or using `pnpm`:

```bash
pnpm add dev-toolkit-91
```

## Quick Start

```typescript
import { SpatialHashGrid, InputMapper } from 'dev-toolkit-91';

// 1. Initialize a Spatial Hash Grid for fast collision queries
const grid = new SpatialHashGrid({ cellSize: 64, bounds: { width: 1920, height: 1080 } });

grid.insert({ id: 'player_1', x: 150, y: 300, radius: 16 });
grid.insert({ id: 'enemy_9', x: 170, y: 310, radius: 16 });

const targets = grid.queryArea({ x: 140, y: 290, width: 50, height: 50 });
console.log(`Found ${targets.length} entities nearby.`);

// 2. Set up frame-accurate input handling
const inputs = new InputMapper();
inputs.bindKey('KeyW', 'MOVE_UP');
inputs.bindKey('Space', 'ATTACK');

function updateGameLoop() {
  inputs.poll();

  if (inputs.isActionActive