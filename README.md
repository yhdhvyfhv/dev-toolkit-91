# dev-toolkit-91

A high-performance TypeScript utility library designed to streamline gaming backend services and data serialization. It provides robust tools for managing game state, networking events, and entity component systems.

## Features

*   **Packet Serialization:** Lightning-fast binary encoding/decoding optimized for WebSocket-based game servers.
*   **Entity State Sync:** Declarative state management for real-time synchronization between client and server.
*   **Vector Math Utilities:** A lightweight set of 2D/3D math primitives tailored for movement logic and collision detection.
*   **Event Emitter:** A type-safe event bus with built-in support for latency-compensated network events.

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

Define a game entity schema and sync its position efficiently:

```typescript
import { GameEntity, Vector3 } from 'dev-toolkit-91';

const player = new GameEntity({
  id: 'hero-01',
  position: new Vector3(0, 0, 0)
});

// Update state and broadcast changes
player.updatePosition(new Vector3(10, 5, 0));
player.sync();
```

## Contributing

We welcome contributions from the gaming community. Please ensure all code is strictly typed and passes existing test suites before submitting a pull request.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Distributed under the MIT License. See `LICENSE` for more information.*