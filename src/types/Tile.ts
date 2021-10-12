type TileMeta = {
  position: [number, number];
  value: number;
  id: number;
};

type ActionMeta =
  | { type: 'CREATE_TILE'; tile: TileMeta }
  | { type: 'UPDATE_TILE'; tile: TileMeta }
  | { type: 'MERGE_TILE'; source: TileMeta; destination: TileMeta }
  | { type: 'START_MOVE' }
  | { type: 'END_MOVE' };

export { TileMeta, ActionMeta };
