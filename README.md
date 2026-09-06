# dev-toolkit-91

A high-performance TypeScript utility library designed to streamline game development workflows and engine-agnostic logic. It provides robust abstractions for real-time game state management, physics calculation helpers, and entity-component system (ECS) utilities.

## Features

*   **State Sync Engine:** Optimized state reconciliation helpers for multiplayer synchronization and snapshot interpolation.
*   **Vector Math Utilities:** A suite of high-precision TypeScript math functions specifically tuned for 2D/3D collision detection and transformation matrices.
*   **Asset Lifecycle Manager:** A Promise-based preloader for textures, sounds, and sprite sheets with built-in retry logic and progress tracking.
*   **Deterministic RNG:** A seedable random number generator designed to keep logic consistent across client-server environments.

## Installation

Install the package via npm:

```bash
npm install dev-toolkit-91
```

Or using yarn:

```bash
yarn add dev-toolkit-91
```

## Usage

Import the utility modules to handle complex game loops or coordinate transformations:

```typescript
import { Vector2, RNG } from 'dev-toolkit-91';

// Initialize a seeded generator for procedural generation
const random = new RNG('seed-value-123');
const spawnPosition = new Vector2(random.next(0, 800), random.next(0, 600));

console.log(`Entity spawned at: ${spawnPosition.x}, ${spawnPosition.y}`);
```

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Distributed under the MIT License. See `LICENSE` for more information.