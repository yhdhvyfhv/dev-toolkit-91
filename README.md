# dev-toolkit-91

A robust TypeScript-based utility library designed to streamline the development of high-performance gaming applications. This toolkit simplifies state management, entity component system (ECS) orchestration, and real-time game loop synchronization.

## Features

*   **High-Frequency State Sync:** Optimized observable patterns for tracking player health, inventory, and world data with minimal latency.
*   **ECS Engine Core:** A modular Entity-Component-System framework that facilitates decoupled game logic and scalable object composition.
*   **Input Normalization:** A unified abstraction layer for handling concurrent keyboard, mouse, and gamepad events across browsers.
*   **Asset Lifecycle Hooks:** Integrated utilities for preloading, caching, and unloading graphical and audio assets during scene transitions.

## Installation

Install the package via npm or yarn:

```bash
npm install dev-toolkit-91
# or
yarn add dev-toolkit-91
```

## Usage

Initialize a game loop and integrate a basic entity manager to handle your game objects:

```typescript
import { GameLoop, EntityManager } from 'dev-toolkit-91';

const entities = new EntityManager();
const loop = new GameLoop((deltaTime) => {
  entities.update(deltaTime);
  entities.render();
});

loop.start();
```

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.