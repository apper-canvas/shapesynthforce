import shapeData from '../mockData/shapes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ShapeService {
  constructor() {
    this.shapes = [...shapeData];
  }

  async getAll() {
    await delay(200);
    return this.shapes.map(s => ({ ...s }));
  }

  async getById(id) {
    await delay(250);
    const shape = this.shapes.find(s => s.id === id);
    if (!shape) {
      throw new Error(`Shape ${id} not found`);
    }
    return { ...shape };
return { ...shape };
  }

  async getByLevel(levelId) {
    await delay(200);
    const levelShapes = this.shapes.filter(s => s.levelId === levelId);
    return levelShapes.map(s => ({
      ...s,
      rotation: 0,
      scale: 1,
      currentMorphIndex: 0
    }));
  }

  async updateShape(id, updates) {
    await delay(300);
    const index = this.shapes.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Shape ${id} not found`);
    }
    this.shapes[index] = { ...this.shapes[index], ...updates };
    return { ...this.shapes[index] };
  }
}

export const shapeService = new ShapeService();
export default shapeService;