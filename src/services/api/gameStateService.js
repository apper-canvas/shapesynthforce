import gameStateData from '../mockData/gameState.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameStateService {
  constructor() {
    this.gameState = { ...gameStateData };
  }

  async getInitial() {
    await delay(200);
    return { ...this.gameState };
  }

  async resetLevel(levelId) {
    await delay(300);
    
    // Reset to initial state for the level
    const levelData = {
      1: { currentLevel: 1, timeRemaining: 60, score: 0, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      2: { currentLevel: 2, timeRemaining: 90, score: 1000, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      3: { currentLevel: 3, timeRemaining: 120, score: 2500, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      4: { currentLevel: 4, timeRemaining: 120, score: 4000, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      5: { currentLevel: 5, timeRemaining: 120, score: 6000, selectedShape: null, placedShapes: [], matchPercentage: 0 }
    };

    this.gameState = { ...levelData[levelId] };
    return { ...this.gameState };
  }

  async advanceLevel(levelId) {
    await delay(300);
    
    const bonusScore = Math.round(this.gameState.timeRemaining * 10);
    const levelData = {
      2: { currentLevel: 2, timeRemaining: 90, score: this.gameState.score + bonusScore, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      3: { currentLevel: 3, timeRemaining: 120, score: this.gameState.score + bonusScore, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      4: { currentLevel: 4, timeRemaining: 120, score: this.gameState.score + bonusScore, selectedShape: null, placedShapes: [], matchPercentage: 0 },
      5: { currentLevel: 5, timeRemaining: 120, score: this.gameState.score + bonusScore, selectedShape: null, placedShapes: [], matchPercentage: 0 }
    };

    if (!levelData[levelId]) {
      throw new Error('Level not found');
    }

    this.gameState = { ...levelData[levelId] };
    return { ...this.gameState };
  }

  async updateScore(points) {
    await delay(100);
    this.gameState.score += points;
    return { ...this.gameState };
  }

  async updateMatchPercentage(percentage) {
    await delay(100);
    this.gameState.matchPercentage = percentage;
    return { ...this.gameState };
  }
}

export default new GameStateService();