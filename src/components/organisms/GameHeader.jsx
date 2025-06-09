import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatDisplay from '@/components/molecules/StatDisplay';
import Text from '@/components/atoms/Text';

const GameHeader = ({ currentLevel, gameState, getMatchColor, getTimerColor }) => {
    const timerWidth = gameState && currentLevel
        ? `${(gameState.timeRemaining / currentLevel.timeLimit) * 100}%`
        : '100%';

    return (
        <header className="flex-shrink-0 h-20 bg-surface-800 border-b border-surface-700 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <ApperIcon name="Shapes" size={24} className="text-primary" />
                    <Text as="h1" className="text-2xl font-heading text-white">ShapeSynth</Text>
                </div>
                <Text className="text-sm text-gray-400">
                    Level {currentLevel?.id} - {currentLevel?.difficulty}
                </Text>
            </div>

            <div className="flex items-center space-x-6">
                <StatDisplay
                    label="Match"
                    value={`${Math.round(gameState?.matchPercentage || 0)}%`}
                    valueClassName={getMatchColor()}
                />

                <StatDisplay
                    label="Time Left"
                    value={`${gameState?.timeRemaining || 0}s`}
                >
                    <div className="w-20 h-2 bg-surface-700 rounded-full mt-1 overflow-hidden">
                        <motion.div
                            className={`h-full bg-gradient-to-r ${getTimerColor()}`}
                            initial={{ width: '100%' }}
                            animate={{ width: timerWidth }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </StatDisplay>

                <StatDisplay
                    label="Score"
                    value={gameState?.score || 0}
                />
            </div>
        </header>
    );
};

export default GameHeader;