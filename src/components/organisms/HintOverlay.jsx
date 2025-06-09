import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const HintOverlay = ({ isVisible, hint, onClose }) => {
    if (!hint) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hint Position Indicator */}
                    <motion.div
                        className="absolute pointer-events-none"
                        style={{
                            left: hint.optimalPosition.x - 25,
                            top: hint.optimalPosition.y - 25,
                            transform: `rotate(${hint.optimalRotation}deg) scale(${hint.optimalScale})`
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Optimal Position Circle */}
                        <div className="w-12 h-12 border-4 border-warning rounded-full bg-warning/20 animate-pulse-hint">
                            <div className="w-full h-full flex items-center justify-center">
                                <ApperIcon name="Target" size={20} className="text-warning" />
                            </div>
                        </div>
                        
                        {/* Rotation Indicator */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                            <ApperIcon name="RotateCw" size={12} className="text-white" />
                        </div>
                    </motion.div>

                    {/* Hint Instructions */}
                    <motion.div
                        className="absolute top-4 left-4 bg-surface-800/95 backdrop-blur-sm border border-warning/30 rounded-lg p-4 max-w-xs"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center space-x-2 mb-2">
                            <ApperIcon name="Lightbulb" size={16} className="text-warning" />
                            <Text className="text-sm font-semibold text-warning">Hint</Text>
                        </div>
                        <Text className="text-xs text-gray-300 mb-2">
                            Optimal position and rotation shown
                        </Text>
                        <div className="text-xs text-gray-400 space-y-1">
                            <div>Position: {Math.round(hint.optimalPosition.x)}, {Math.round(hint.optimalPosition.y)}</div>
                            <div>Rotation: {hint.optimalRotation}°</div>
                            <div>Scale: {hint.optimalScale}x</div>
                        </div>
                        
                        {/* Auto-dismiss indicator */}
                        <motion.div
                            className="mt-3 h-1 bg-surface-700 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.div
                                className="h-full bg-warning"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 3, ease: "linear" }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Pulsing arrows pointing to optimal position */}
                    <motion.div
                        className="absolute pointer-events-none"
                        style={{
                            left: hint.optimalPosition.x - 60,
                            top: hint.optimalPosition.y - 10
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ApperIcon name="ArrowRight" size={24} className="text-warning drop-shadow-lg" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="absolute pointer-events-none"
                        style={{
                            left: hint.optimalPosition.x + 35,
                            top: hint.optimalPosition.y - 10
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div
                            animate={{ x: [0, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ApperIcon name="ArrowLeft" size={24} className="text-warning drop-shadow-lg" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HintOverlay;