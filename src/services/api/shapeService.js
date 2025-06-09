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
  }

  async getByLevel(levelId) {
    await delay(300);
    return this.shapes
      .filter(s => s.levelId === levelId)
      .map(s => ({ 
        ...s, 
        position: { x: null, y: null }, // Reset position
        rotation: 0, // Reset rotation
        scale: 1, // Reset scale
        currentMorphIndex: 0 // Reset morph state
      }));
  }

  async updateShape(id, updates) {
    await delay(200);
    const index = this.shapes.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Shape ${id} not found`);
    }
    this.shapes[index] = { ...this.shapes[index], ...updates };
    return { ...this.shapes[index] };
  }
}

export default new ShapeService();