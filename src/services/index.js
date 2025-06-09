// Import default exports and re-export with named exports
import gameStateServiceDefault from './api/gameStateService.js';
import levelServiceDefault from './api/levelService.js';
import shapeServiceDefault from './api/shapeService.js';
import hintServiceDefault from './api/hintService.js';

// Re-export with the expected named export syntax
export const gameStateService = gameStateServiceDefault;
export const levelService = levelServiceDefault;
export const shapeService = shapeServiceDefault;
export const hintService = hintServiceDefault;