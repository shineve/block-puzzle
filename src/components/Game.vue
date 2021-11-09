<template>
  <Board :tiles="tileList" :tile-count-per-row-or-column="tileCountPerRowOrColumn.value"></Board>
</template>

<script lang="ts">
import { ref, reactive, onUpdated, onBeforeUnmount, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { TileMeta, ActionMeta } from '@/types/Tile';
import { tileCountPerRowOrColumn as tileCount, animationDuration } from '@/config';
import Board from '@/components/Board.vue';
import { throttle, cloneDeep } from 'lodash';

type StateMeta = {
  tiles: {
    [id: number]: TileMeta;
  };
  inMotion: boolean;
  hasChanged: boolean;
  byIds: number[];
  lastId: number;
};

type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];

type CalculateTileIndex = (
  tileIndex: number,
  tileInRowIndex: number,
  howManyMerges: number,
  maxIndexInRow: number,
) => number;

const initialState: StateMeta = {
  tiles: {},
  byIds: [],
  hasChanged: false,
  inMotion: false,
  lastId: 0,
};

const actionHandler = (state: StateMeta, action: ActionMeta) => {
  switch (action.type) {
    case 'CREATE_TILE':
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.tile.id]: action.tile,
        },
        byIds: [...state.byIds, action.tile.id],
        hasChanged: false,
      };
    case 'UPDATE_TILE':
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.tile.id]: action.tile,
        },
        hasChanged: true,
      };
    case 'MERGE_TILE':
      const {
        [action.source.id]: source,
        [action.destination.id]: destination,
        ...restTiles
      } = state.tiles;

      return {
        ...state,
        tiles: {
          ...restTiles,
          [action.destination.id]: {
            id: action.destination.id,
            value: action.source.value + action.destination.value,
            position: action.destination.position,
          },
        },
        byIds: state.byIds.filter(id => id !== action.source.id),
        hasChanged: true,
      };
    case 'START_MOVE':
      return {
        ...state,
        inMotion: true,
      };
    case 'END_MOVE':
      return {
        ...state,
        inMotion: false,
      };
    default:
      return state;
  }
};

export default {
  components: {
    Board,
  },
  setup() {
    const store = useStore();
    let count = 0;
    let lastGeneratedCount = 0;
    let tileCountPerRowOrColumn = ref(tileCount);
    let isInitialRender = true;
    let initialValue = initialState;

    if (localStorage.getItem('game')) {
      Object.assign(initialValue, JSON.parse(localStorage.getItem('game')));
      isInitialRender = false;
    }

    let state: StateMeta = reactive(initialValue);
    let tileList = computed(() => {
      return state.byIds.map(tileId => state.tiles[tileId]);
    });

    const createTile = ({ position, value }: Partial<TileMeta>) => {
      state.lastId++;
      const tile = {
        id: state.lastId,
        position,
        value,
      } as TileMeta;

      Object.assign(state, actionHandler(state, { type: 'CREATE_TILE', tile }));
    };

    const updateTile = (tile: TileMeta) => {
      Object.assign(state, actionHandler(state, { type: 'UPDATE_TILE', tile }));
    };

    const mergeTile = (source: TileMeta, destination: TileMeta) => {
      Object.assign(state, actionHandler(state, { type: 'MERGE_TILE', source, destination }));
    };

    const move = (
      retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
      calculateFirstFreeIndex: CalculateTileIndex,
    ) => {
      // new tiles cannot be created during motion.
      Object.assign(state, { type: 'START_MOVE' });

      const maxIndex = tileCountPerRowOrColumn.value - 1;

      // iterates through every row or column (depends on move kind - vertical or horizontal).
      for (
        let rowOrColumnIndex = 0;
        rowOrColumnIndex < tileCountPerRowOrColumn.value;
        rowOrColumnIndex += 1
      ) {
        // retrieves tiles in the row or column.
        const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);

        // previousTile is used to determine if tile can be merged with the current tile.
        let previousTile: TileMeta | undefined;
        // mergeCount helps to fill gaps created by tile merges - two tiles become one.
        let mergedTilesCount = 0;

        // interate through available tiles.
        availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
          const currentTile = state.tiles[tileId];

          // if previous tile has the same value as the current one they should be merged together.
          if (previousTile !== undefined && previousTile.value === currentTile.value) {
            const tile = {
              ...currentTile,
              position: previousTile.position,
              mergeWith: previousTile.id,
            } as TileMeta;

            // delays the merge by 250ms, so the sliding animation can be completed.
            throttledMergeTile(tile, previousTile);
            // previous tile must be cleared as a single tile can be merged only once per move.
            previousTile = undefined;
            // increment the merged counter to correct position for the consecutive tiles to get rid of gaps
            mergedTilesCount += 1;

            return updateTile(tile);
          }

          // else - previous and current tiles are different - move the tile to the first free space.
          const tile = {
            ...currentTile,
            position: indexToPosition(
              calculateFirstFreeIndex(
                rowOrColumnIndex,
                nonEmptyTileIndex,
                mergedTilesCount,
                maxIndex,
              ),
            ),
          } as TileMeta;

          // previous tile become the current tile to check if the next tile can be merged with this one.
          previousTile = tile;

          // only if tile has changed its position it will be updated
          if (didTileMove(currentTile, tile)) {
            return updateTile(tile);
          }
        });
      }

      // wait until the end of all animations.
      setTimeout(() => {
        Object.assign(state, { type: 'END_MOVE' });
      }, animationDuration);
    };

    // A must-have to keep the sliding animation if the action merges tiles together.
    const throttledMergeTile = (source: TileMeta, destination: TileMeta) => {
      setTimeout(() => mergeTile(source, destination), animationDuration);
    };

    const didTileMove = (source: TileMeta, destination: TileMeta) => {
      const hasXChanged = source.position[0] !== destination.position[0];
      const hasYChanged = source.position[1] !== destination.position[1];

      return hasXChanged || hasYChanged;
    };

    const generateRandomTile = () => {
      let value: number = 2;
      const emptyTiles = findEmptyTiles();
      const currentLargestValue = findLargestTile();

      if (emptyTiles.length > 0) {
        const index = Math.floor(Math.random() * emptyTiles.length);
        const position = emptyTiles[index];

        createTile({ position, value });
      }
    };

    const positionToIndex = (position: [number, number]) => {
      return position[1] * tileCountPerRowOrColumn.value + position[0];
    };

    const indexToPosition = (index: number) => {
      const x = index % tileCountPerRowOrColumn.value;
      const y = Math.floor(index / tileCountPerRowOrColumn.value);
      return [x, y];
    };

    const retrieveTileMap = () => {
      const tileMap = new Array(tileCountPerRowOrColumn.value * tileCountPerRowOrColumn.value).fill(
        0,
      ) as number[];

      state.byIds.forEach(id => {
        const { position } = state.tiles[id];
        const index = positionToIndex(position);
        tileMap[index] = id;
      });

      return tileMap;
    };

    const findLargestTile = () => {
      let largest = 2;

      Object.values(state.tiles).forEach(tile => {
        if (tile.value > largest) {
          largest = tile.value;
        }
      });
      return largest;
    };

    const findEmptyTiles = () => {
      const tileMap = retrieveTileMap();

      const emptyTiles = tileMap.reduce((result, tileId, index) => {
        if (tileId === 0) {
          return [...result, indexToPosition(index) as [number, number]];
        }

        return result;
      }, [] as [number, number][]);

      return emptyTiles;
    };

    const moveLeftFactory = () => {
      const retrieveTileIdsByRow = (rowIndex: number) => {
        const tileMap = retrieveTileMap();

        const tileIdsInRow = [
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 0],
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 1],
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 2],
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 3],
        ];

        const nonEmptyTiles = tileIdsInRow.filter(id => id !== 0);
        return nonEmptyTiles;
      };

      const calculateFirstFreeIndex = (
        tileIndex: number,
        tileInRowIndex: number,
        howManyMerges: number,
        _: number,
      ) => {
        return tileIndex * tileCountPerRowOrColumn.value + tileInRowIndex - howManyMerges;
      };

      return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
    };

    const moveRightFactory = () => {
      const retrieveTileIdsByRow = (rowIndex: number) => {
        const tileMap = retrieveTileMap();

        const tileIdsInRow = [
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 0],
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 1],
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 2],
          tileMap[rowIndex * tileCountPerRowOrColumn.value + 3],
        ];

        const nonEmptyTiles = tileIdsInRow.filter(id => id !== 0);
        return nonEmptyTiles.reverse();
      };

      const calculateFirstFreeIndex = (
        tileIndex: number,
        tileInRowIndex: number,
        howManyMerges: number,
        maxIndexInRow: number,
      ) => {
        return (
          tileIndex * tileCountPerRowOrColumn.value + maxIndexInRow + howManyMerges - tileInRowIndex
        );
      };

      return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
    };

    const moveUpFactory = () => {
      const retrieveTileIdsByColumn = (columnIndex: number) => {
        const tileMap = retrieveTileMap();

        const tileIdsInColumn = [
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 0],
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 1],
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 2],
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 3],
        ];

        const nonEmptyTiles = tileIdsInColumn.filter(id => id !== 0);
        return nonEmptyTiles;
      };

      const calculateFirstFreeIndex = (
        tileIndex: number,
        tileInColumnIndex: number,
        howManyMerges: number,
        _: number,
      ) => {
        return tileIndex + tileCountPerRowOrColumn.value * (tileInColumnIndex - howManyMerges);
      };

      return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
    };

    const moveDownFactory = () => {
      const retrieveTileIdsByColumn = (columnIndex: number) => {
        const tileMap = retrieveTileMap();

        const tileIdsInColumn = [
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 0],
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 1],
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 2],
          tileMap[columnIndex + tileCountPerRowOrColumn.value * 3],
        ];

        const nonEmptyTiles = tileIdsInColumn.filter(id => id !== 0);
        return nonEmptyTiles.reverse();
      };

      const calculateFirstFreeIndex = (
        tileIndex: number,
        tileInColumnIndex: number,
        howManyMerges: number,
        maxIndexInColumn: number,
      ) => {
        return (
          tileIndex +
          tileCountPerRowOrColumn.value * (maxIndexInColumn - tileInColumnIndex + howManyMerges)
        );
      };

      return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
    };

    const updateCache = () => {
      const { tiles, byIds, lastId } = state;
      localStorage.setItem('game', JSON.stringify({ tiles, byIds, lastId }));
    };

    onUpdated(() => {
      setTimeout(() => {
        if (!state.inMotion && state.hasChanged && lastGeneratedCount !== count) {
          lastGeneratedCount = count;
          generateRandomTile();
          updateCache();
        }
      }, animationDuration);
    });

    const moveLeft = moveLeftFactory();
    const moveRight = moveRightFactory();
    const moveUp = moveUpFactory();
    const moveDown = moveDownFactory();

    const handleKeyDown = function (e: KeyboardEvent) {
      count++;
      e.preventDefault();

      switch (e.code) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }
    };

    const handleTouchEvent = function (e: TouchEvent) {
      count++;
      e.preventDefault();
      const eventType = e.detail.dir;

      switch (eventType) {
        case 'left':
          moveLeft();
          break;
        case 'right':
          moveRight();
          break;
        case 'up':
          moveUp();
          break;
        case 'down':
          moveDown();
          break;
      }
    };

    onMounted(() => {
      if (isInitialRender) {
        generateRandomTile();
        generateRandomTile();
        isInitialRender = false;
      }

      window.addEventListener(
        'keydown',
        throttle(handleKeyDown, animationDuration, { leading: true, trailing: false }),
      );

      document.addEventListener(
        'swiped',
        throttle(handleTouchEvent, animationDuration, { leading: true, trailing: false }),
      );
    });

    onBeforeUnmount(() => {
      window.removeEventListener(
        'keydown',
        throttle(handleKeyDown, animationDuration, { leading: true, trailing: false }),
      );

      document.removeEventListener(
        'swiped',
        throttle(handleTouchEvent, animationDuration, { leading: true, trailing: false }),
      );
    });

    return {
      tileCountPerRowOrColumn,
      tileList,
    };
  },
};
</script>
