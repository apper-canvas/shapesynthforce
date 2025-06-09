import React from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const ControlPanel = ({ 
    selectedShape, 
    gameStarted, 
    gameOver, 
    hintsRemaining,
    onRotate, 
    onShrink, 
    onGrow, 
    onRestartLevel,
    onUseHint
}) => {
    return (
        <div className="flex-shrink-0 h-24 bg-surface-800 border-t border-surface-700 px-6">
            <div className="h-full flex items-center justify-between">
<div className="flex space-x-4">
                    <Text className="text-sm text-gray-400">
                        {selectedShape ? `Shape ${selectedShape} selected` : 'Select a shape to manipulate'}
                    </Text>
                </div>

                <div className="flex items-center space-x-3">
                    {gameStarted && !gameOver && (
<>
                            <Button
                                onClick={onUseHint}
                                disabled={!selectedShape || hintsRemaining <= 0}
                                className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center shadow-lg ${
                                    selectedShape && hintsRemaining > 0
                                        ? 'bg-warning hover:bg-warning/80 border-warning text-white hover:shadow-warning/25'
                                        : 'bg-surface-700 border-surface-600 text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                                whileHover={selectedShape && hintsRemaining > 0 ? { scale: 1.05, y: -2 } : {}}
                                whileTap={selectedShape && hintsRemaining > 0 ? { scale: 0.95 } : {}}
                            >
                                <ApperIcon 
                                    name="Lightbulb" 
                                    size={16} 
                                    className={`mr-2 ${selectedShape && hintsRemaining > 0 ? 'animate-pulse' : ''}`} 
                                />
                                Hint
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold transition-all ${
                                    hintsRemaining > 0 
                                        ? 'bg-white text-warning shadow-sm' 
                                        : 'bg-surface-600 text-gray-500'
                                }`}>
                                    {hintsRemaining}
                                </span>
                            </Button>

                            <Button
                                onClick={onRotate}
                                disabled={!selectedShape}
                                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    selectedShape 
                                        ? 'bg-primary hover:bg-primary/80 border-primary text-white' 
                                        : 'bg-surface-700 border-surface-600 text-gray-400 cursor-not-allowed'
                                }`}
                                whileHover={selectedShape ? { scale: 1.02 } : {}}
                                whileTap={selectedShape ? { scale: 0.98 } : {}}
                            >
                                <ApperIcon name="RotateCw" size={16} className="mr-2" />
                                Rotate
                            </Button>

<Button
                                onClick={onShrink}
                                disabled={!selectedShape}
                                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    selectedShape 
                                        ? 'bg-secondary hover:bg-secondary/80 border-secondary text-white' 
                                        : 'bg-surface-700 border-surface-600 text-gray-400 cursor-not-allowed'
                                }`}
                                whileHover={selectedShape ? { scale: 1.02 } : {}}
                                whileTap={selectedShape ? { scale: 0.98 } : {}}
                            >
                                <ApperIcon name="Minus" size={16} className="mr-2" />
                                Shrink
                            </Button>

                            <Button
                                onClick={onGrow}
                                disabled={!selectedShape}
                                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    selectedShape 
                                        ? 'bg-success hover:bg-success/80 border-success text-white' 
                                        : 'bg-surface-700 border-surface-600 text-gray-400 cursor-not-allowed'
                                }`}
                                whileHover={selectedShape ? { scale: 1.02 } : {}}
                                whileTap={selectedShape ? { scale: 0.98 } : {}}
                            >
                                <ApperIcon name="Plus" size={16} className="mr-2" />
                                Grow
                            </Button>
                        </>
                    )}

                    <Button
                        onClick={onRestartLevel}
                        disabled={!gameStarted}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                            gameStarted
                                ? 'bg-warning hover:bg-warning/80 border-warning text-white'
                                : 'bg-surface-700 border-surface-600 text-gray-400 cursor-not-allowed'
                        }`}
                        whileHover={gameStarted ? { scale: 1.02 } : {}}
                        whileTap={gameStarted ? { scale: 0.98 } : {}}
                    >
                        <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                        Restart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;