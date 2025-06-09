import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const GameOverlay = ({ type, isVisible, gameState, currentLevel, onStartGame, onRestartLevel, onNextLevel }) => {
    if (!isVisible) return null;

    let icon, title, message, buttons;

    switch (type) {
        case 'start':
            icon = <ApperIcon name="Play" size={24} className="inline mr-2" />;
            title = `Start Level ${currentLevel?.id}`;
            message = '';
            buttons = (
                <Button
                    onClick={onStartGame}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-xl font-heading rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {icon}
                    {title}
                </Button>
            );
            break;
        case 'game_over':
            icon = <ApperIcon name="Clock" size={48} className="text-error mx-auto mb-4" />;
            title = "Time's Up!";
            message = `You reached ${Math.round(gameState?.matchPercentage || 0)}% accuracy`;
            buttons = (
                <div className="flex space-x-4">
                    <Button
                        onClick={onRestartLevel}
                        className="flex-1 px-4 py-2 bg-surface-700 text-white rounded-lg border border-surface-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Try Again
                    </Button>
                </div>
            );
            break;
        case 'success':
            icon = (
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                >
                    <ApperIcon name="Trophy" size={48} className="text-success mx-auto" />
                </motion.div>
            );
            title = "Perfect Match!";
            message = `You achieved ${Math.round(gameState?.matchPercentage || 0)}% accuracy!`;
            buttons = (
                <div className="flex space-x-4">
                    <Button
                        onClick={onRestartLevel}
                        className="flex-1 px-4 py-2 bg-surface-700 text-white rounded-lg border border-surface-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Replay
                    </Button>
                    <Button
                        onClick={onNextLevel}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-success to-primary text-white rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Next Level
                    </Button>
                </div>
            );
            break;
        default:
            return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`absolute inset-0 flex items-center justify-center ${type === 'start' ? 'bg-black/50' : 'bg-black/70'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {type === 'start' ? (
                        buttons
                    ) : (
                        <motion.div
                            className="bg-surface-800 p-8 rounded-xl border border-surface-700 text-center max-w-md"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            {icon}
                            <Text as="h2" className="text-2xl font-heading text-white mb-2">{title}</Text>
                            <Text className="text-gray-400 mb-6">{message}</Text>
                            {buttons}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GameOverlay;