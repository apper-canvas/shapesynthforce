import hintsData from '@/services/mockData/hints.json';

class HintService {
    async getOptimalSolution(levelId, shapeId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const levelHints = hintsData.find(level => level.levelId === levelId);
        if (!levelHints) {
            throw new Error(`No hints available for level ${levelId}`);
        }
        
        const shapeHint = levelHints.hints.find(hint => hint.shapeId === shapeId);
        if (!shapeHint) {
            throw new Error(`No hint available for shape ${shapeId} in level ${levelId}`);
        }
        
        return { ...shapeHint };
    }
    
    async getAllLevelHints(levelId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const levelHints = hintsData.find(level => level.levelId === levelId);
        if (!levelHints) {
            throw new Error(`No hints available for level ${levelId}`);
        }
        
        return { ...levelHints };
    }
}

export const hintService = new HintService();