# dev-toolkit-91

A high-performance TypeScript utility library designed to streamline game logic implementation and state management. This toolkit provides specialized hooks and data structures to minimize boilerplate code in browser-based game development.

## Features

*   **Entity-Component System (ECS):** A lightweight, memory-efficient ECS framework built for real-time game state synchronization.
*   **Vector & Math Math Utilities:** Optimized 2D/3D vector math functions designed for smooth movement and collision detection.
*   **Input Handling:** Robust event-driven input polling for keyboard, mouse, and gamepad support with configurable binding maps.
*   **Asset Preloader:** Asynchronous resource management system that tracks loading states for textures, audio, and JSON manifests.

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

Import the core modules to initialize your game state and input listeners:

```typescript
import { Engine, Vector2, InputManager } from 'dev-toolkit-91';

const game = new Engine({ width: 800, height: 600 });
const input = new InputManager();

input.bind('ArrowRight', () => {
  console.log('Player moved right');
});

game.update((dt) => {
  // Logic execution
});
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.