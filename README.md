# dev-toolkit-91

A high-performance TypeScript utility library designed to streamline the development of gaming backend services. It provides optimized primitives for state synchronization, entity interpolation, and low-latency packet handling.

## Features

*   **Fixed-Step Simulation Engine:** A deterministic game loop implementation that ensures consistent physics calculations across varying server tick rates.
*   **Binary Buffer Serializer:** Highly optimized decorators for compact binary data serialization, reducing network payload overhead by up to 60%.
*   **Spatial Hashing Grid:** An O(1) complexity spatial query system for efficient proximity detection and collision filtering.
*   **Event-Driven Sync:** Built-in Pub/Sub patterns specifically tuned for real-time game state broadcasts with minimal event propagation delay.

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

Implement a synchronized game entity by extending the base class:

```typescript
import { Entity, sync } from 'dev-toolkit-91';

class Player extends Entity {
  @sync()
  public health: number = 100;

  @sync()
  public position: { x: number; y: number } = { x: 0, y: 0 };
}

const player = new Player();

// Access the optimized sync stream for network broadcasts
const packet = player.serialize();
console.log('Sending state:', packet);
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.