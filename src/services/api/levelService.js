import levelData from '../mockData/levels.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LevelService {
  constructor() {
    this.levels = [...levelData];
  }

  async getAll() {
    await delay(200);
    return [...this.levels];
  }

  async getById(id) {
    await delay(250);
    const level = this.levels.find(l => l.id === id);
    if (!level) {
      throw new Error(`Level ${id} not found`);
    }
    return { ...level };
  }

  async getByDifficulty(difficulty) {
    await delay(300);
    return this.levels.filter(l => l.difficulty === difficulty).map(l => ({ ...l }));
  }
}

export default new LevelService();