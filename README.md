# dev-toolkit-91

A robust TypeScript-based utility library designed to streamline high-performance game logic development. This toolkit abstracts complex engine tasks into clean, reusable modules for state management, physics calculation, and asset loading.

## Features

*   **State Sync Manager:** Real-time state synchronization optimized for low-latency multiplayer environments.
*   **Vector Math Utilities:** High-performance, memory-efficient math helpers for 2D/3D coordinate transformations.
*   **Asset Preloader:** Asynchronous asset handling with progress tracking for textures, audio, and JSON data.
*   **Input Mapping:** Unified event-driven input abstraction supporting keyboard, mouse, and gamepad bindings.

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

Import the necessary utilities to handle your game's input mapping and physics calculations:

```typescript
import { InputManager, Vector2D } from 'dev-toolkit-91';

const input = new InputManager();
const velocity = new Vector2D(0, 5);

input.bind('Space', () => {
  console.log('Jump action triggered');
});

// Update logic
velocity.multiply(1.5);
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.