import React from 'react';
import { motion } from 'framer-motion';

const DraggableShape = ({ shapeData, isSelected, isGameActive, onSelect, onDragStartHandler, onDragEndHandler, initialPosition }) => {
    const { id, position, rotation, scale, currentMorphIndex, morphStates } = shapeData;
    const currentMorphState = morphStates[currentMorphIndex];

    return (
        <motion.div
            className={`absolute cursor-grab select-none ${
                isSelected ? 'z-20' : 'z-10'
            }`}
            style={{
                left: position.x !== null ? position.x : initialPosition.x,
                top: position.y !== null ? position.y : initialPosition.y,
                transform: `rotate(${rotation}deg) scale(${scale})`
            }}
            drag={isGameActive}
            dragMomentum={false}
            onDragStart={() => onDragStartHandler(id)}
            onDragEnd={(event, info) => onDragEndHandler(id, info)}
            onClick={() => onSelect(id)}
            whileHover={{ scale: scale * 1.1 }}
            whileDrag={{ scale: scale * 1.2 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: scale }}
            exit={{ opacity: 0, scale: 0 }}
        >
            <div
                className={`w-20 h-20 rounded-lg shadow-lg transition-all duration-500 ${
                    isSelected
                        ? 'ring-4 ring-accent shape-glow'
                        : 'shape-glow'
                }`}
                style={{
                    background: `linear-gradient(135deg, ${
                        currentMorphState?.color1 || '#8B5CF6'
                    } 0%, ${
                        currentMorphState?.color2 || '#EC4899'
                    } 100%)`,
                    borderRadius: currentMorphState?.borderRadius || '8px'
                }}
            />
            {isSelected && (
                <motion.div
                    className="absolute -inset-2 border-2 border-accent rounded-xl opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
};

export default DraggableShape;