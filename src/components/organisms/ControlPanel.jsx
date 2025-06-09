import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ControlPanel = ({ selectedShape, gameStarted, gameOver, onRotate, onShrink, onGrow, onRestartLevel }) => {
    const isControlDisabled = !selectedShape || !gameStarted || gameOver;
    const isRestartDisabled = !gameStarted;

    return (
        <div className="flex-shrink-0 h-24 bg-surface-800 border-t border-surface-700 px-6 flex items-center justify-center">
            <div className="flex items-center space-x-6">
                <Button
                    onClick={onRotate}
                    disabled={isControlDisabled}
                    className="px-6 py-3 bg-surface-700 text-white rounded-lg border border-surface-600 disabled:opacity-50 flex items-center space-x-2"
                    whileHover={{ scale: isControlDisabled ? 1 : 1.05 }}
                    whileTap={{ scale: isControlDisabled ? 1 : 0.95 }}
                >
                    <ApperIcon name="RotateCw" size={20} />
                    <span>Rotate</span>
                </Button>

                <Button
                    onClick={onShrink}
                    disabled={isControlDisabled}
                    className="px-6 py-3 bg-surface-700 text-white rounded-lg border border-surface-600 disabled:opacity-50 flex items-center space-x-2"
                    whileHover={{ scale: isControlDisabled ? 1 : 1.05 }}
                    whileTap={{ scale: isControlDisabled ? 1 : 0.95 }}
                >
                    <ApperIcon name="Minus" size={20} />
                    <span>Shrink</span>
                </Button>

                <Button
                    onClick={onGrow}
                    disabled={isControlDisabled}
                    className="px-6 py-3 bg-surface-700 text-white rounded-lg border border-surface-600 disabled:opacity-50 flex items-center space-x-2"
                    whileHover={{ scale: isControlDisabled ? 1 : 1.05 }}
                    whileTap={{ scale: isControlDisabled ? 1 : 0.95 }}
                >
                    <ApperIcon name="Plus" size={20} />
                    <span>Grow</span>
                </Button>

                <Button
                    onClick={onRestartLevel}
                    disabled={isRestartDisabled}
                    className="px-6 py-3 bg-gradient-to-r from-warning to-error text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
                    whileHover={{ scale: isRestartDisabled ? 1 : 1.05 }}
                    whileTap={{ scale: isRestartDisabled ? 1 : 0.95 }}
                >
                    <ApperIcon name="RotateCcw" size={20} />
                    <span>Restart</span>
                </Button>
            </div>
        </div>
    );
};

export default ControlPanel;