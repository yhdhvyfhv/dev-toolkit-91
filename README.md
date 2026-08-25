# dev-toolkit-91

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

dev-toolkit-91 is a TypeScript library that provides utilities for building efficient 2D games in the browser. It focuses on core systems like game loops and input to help developers prototype and ship games faster without unnecessary complexity.

## Features

- Fixed timestep game loop with delta time calculations for consistent physics across devices
- Entity-component system for composing game objects without deep inheritance
- Asynchronous asset loader with batch operations and memory caching
- Unified input manager supporting keyboard, mouse, and touch with polling support

## Installation

```bash
npm install dev-toolkit-91
```

## Usage

```typescript
import { GameLoop, AssetLoader, InputManager } from 'dev-toolkit-91';

const assets = new AssetLoader();
await assets.load([
  { id: 'player', url: '/assets/player.png' }
]);

const input = new InputManager();
const loop = new GameLoop({
  update: (dt) => {
    if (input.isPressed('Space')) {
      // trigger action
    }
  },
  render: () => {
    // draw to canvas
  }
});

loop.start();
```