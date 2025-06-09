import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TargetOutline from '@/components/molecules/TargetOutline';
import DraggableShape from '@/components/molecules/DraggableShape';

const GameCanvas = ({
    canvasRef,
    shapes,
    selectedShape,
    draggedShape,
    setDraggedShape, // Added setter for dragged shape
    currentLevel,
    gameStarted,
    gameOver,
    onShapeSelect,
    onShapeDragEnd
}) => {
    const handleDragStart = (shapeId) => {
        setDraggedShape(shapeId);
    };

    const handleDragEnd = (shapeId, info) => {
        setDraggedShape(null);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            onShapeDragEnd(shapeId, {
                x: info.point.x - rect.left,
                y: info.point.y - rect.top
            });
        }
    };

    return (
        <div className="flex-1 relative overflow-hidden">
            <div
                ref={canvasRef}
                className="w-full h-full relative bg-gradient-to-br from-surface-900 to-surface-800"
                style={{ cursor: draggedShape ? 'grabbing' : 'default' }}
            >
                <TargetOutline targetOutlineData={currentLevel?.targetOutline} />

                <AnimatePresence>
                    {shapes.map((shape, index) => (
                        <DraggableShape
                            key={shape.id}
                            shapeData={shape}
                            isSelected={selectedShape === shape.id}
                            isGameActive={gameStarted && !gameOver}
                            onSelect={onShapeSelect}
                            onDragStartHandler={handleDragStart}
                            onDragEndHandler={handleDragEnd}
                            initialPosition={{ x: 50 + index * 120, y: 50 }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GameCanvas;