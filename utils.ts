export interface GameState {
  entities: Record<string, number>;
  tick: number;
  flags: Set<string>;
}

export const packEntityState = (state: GameState): Uint8Array => {
  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);
  view.setUint32(0, state.tick);
  view.setUint8(4, state.flags.size);
  
  let offset = 5;
  for (const [id, val] of Object.entries(state.entities)) {
    if (offset > 12) break;
    view.setUint16(offset, parseInt(id));
    view.setUint8(offset + 2, val);
    offset += 3;
  }
  return new Uint8Array(buffer);
};

export const unpackEntityState = (data: Uint8Array): Partial<GameState> => {
  const view = new DataView(data.buffer);
  const entities: Record<string, number> = {};
  const count = view.getUint8(4);
  
  for (let i = 0; i < count; i++) {
    const pos = 5 + (i * 3);
    if (pos + 2 < data.length) {
      entities[view.getUint16(pos).toString()] = view.getUint8(pos + 2);
    }
  }
  
  return { tick: view.getUint32(0), entities };
};

export const mutateState = (state: GameState, id: string, val: number): GameState => ({
  ...state,
  entities: { ...state.entities, [id]: val },
  tick: state.tick + 1
});