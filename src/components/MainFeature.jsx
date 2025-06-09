import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { gameStateService, levelService, shapeService } from '../services';

const MainFeature = () => {
  const [gameState, setGameState] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [draggedShape, setDraggedShape] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const morphTimerRef = useRef(null);

  // Load initial game data
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoading(true);
        const initialState = await gameStateService.getInitial();
        const level = await levelService.getById(1);
        const levelShapes = await shapeService.getByLevel(1);
        
        setGameState(initialState);
        setCurrentLevel(level);
        setShapes(levelShapes);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load game');
        setLoading(false);
      }
    };

    initializeGame();
  }, []);

  // Game timer
  useEffect(() => {
    if (gameStarted && gameState && !gameOver) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          if (newTimeRemaining <= 0) {
            setGameOver(true);
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameState, gameOver]);

  // Shape morphing timer
  useEffect(() => {
    if (gameStarted && currentLevel && !gameOver) {
      morphTimerRef.current = setInterval(() => {
        setShapes(prev => prev.map(shape => ({
          ...shape,
          currentMorphIndex: (shape.currentMorphIndex + 1) % shape.morphStates.length
        })));
      }, currentLevel.morphSpeed);
    }

    return () => {
      if (morphTimerRef.current) clearInterval(morphTimerRef.current);
    };
  }, [gameStarted, currentLevel, gameOver]);

  // Calculate match percentage
  const calculateMatchPercentage = useCallback(() => {
    if (!shapes.length || !currentLevel?.targetOutline) return 0;
    
    // Simplified match calculation based on shape positions and target
    const placedShapes = shapes.filter(shape => shape.position.x !== null);
    if (!placedShapes.length) return 0;

    // Calculate overlap based on distance from target center
    const targetCenter = { x: 400, y: 300 };
    let totalMatch = 0;
    
    placedShapes.forEach(shape => {
      const distance = Math.sqrt(
        Math.pow(shape.position.x - targetCenter.x, 2) + 
        Math.pow(shape.position.y - targetCenter.y, 2)
      );
      const maxDistance = 200;
      const match = Math.max(0, (maxDistance - distance) / maxDistance * 100);
      totalMatch += match;
    });

    return Math.min(100, totalMatch / placedShapes.length);
  }, [shapes, currentLevel]);

  // Update match percentage
  useEffect(() => {
    if (gameStarted) {
      const percentage = calculateMatchPercentage();
      setGameState(prev => ({ ...prev, matchPercentage: percentage }));
      
      if (percentage >= currentLevel?.requiredAccuracy) {
        setShowSuccessModal(true);
        setGameStarted(false);
      }
    }
  }, [shapes, gameStarted, currentLevel, calculateMatchPercentage]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setShowSuccessModal(false);
  };

  const restartLevel = async () => {
    try {
      const levelShapes = await shapeService.getByLevel(currentLevel.id);
      const resetState = await gameStateService.resetLevel(currentLevel.id);
      
      setShapes(levelShapes);
      setGameState(resetState);
      setGameOver(false);
      setShowSuccessModal(false);
      setSelectedShape(null);
      setDraggedShape(null);
    } catch (error) {
      toast.error('Failed to restart level');
    }
  };

  const nextLevel = async () => {
    try {
      const nextLevelId = currentLevel.id + 1;
      const level = await levelService.getById(nextLevelId);
      const levelShapes = await shapeService.getByLevel(nextLevelId);
      const newState = await gameStateService.advanceLevel(nextLevelId);
      
      setCurrentLevel(level);
      setShapes(levelShapes);
      setGameState(newState);
      setShowSuccessModal(false);
      setSelectedShape(null);
      setDraggedShape(null);
      setGameStarted(true);
    } catch (error) {
      toast.error('No more levels available');
      setShowSuccessModal(false);
    }
  };

  const handleShapeSelect = (shapeId) => {
    setSelectedShape(shapeId);
  };

  const handleShapeDrag = (shapeId, position) => {
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, position } 
        : shape
    ));
  };

  const handleShapeRotate = () => {
    if (!selectedShape) return;
    
    setShapes(prev => prev.map(shape => 
      shape.id === selectedShape 
        ? { ...shape, rotation: (shape.rotation + 15) % 360 }
        : shape
    ));
  };

  const handleShapeScale = (delta) => {
    if (!selectedShape) return;
    
    setShapes(prev => prev.map(shape => 
      shape.id === selectedShape 
        ? { 
            ...shape, 
            scale: Math.max(0.5, Math.min(2, shape.scale + delta))
          }
        : shape
    ));
  };

  const getTimerColor = () => {
    if (!gameState) return 'from-info to-primary';
    const percentage = (gameState.timeRemaining / currentLevel?.timeLimit) * 100;
    if (percentage > 50) return 'from-info to-primary';
    if (percentage > 25) return 'from-warning to-error';
    return 'from-error to-error';
  };

  const getMatchColor = () => {
    if (!gameState) return 'text-gray-400';
    const percentage = gameState.matchPercentage;
    if (percentage >= currentLevel?.requiredAccuracy) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-error';
  };

  if (loading) {
    return (
      <div className="h-screen bg-surface-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <ApperIcon name="Loader" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface-900 flex flex-col overflow-hidden">
      {/* Header with stats */}
      <header className="flex-shrink-0 h-20 bg-surface-800 border-b border-surface-700 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Shapes" size={24} className="text-primary" />
            <h1 className="text-2xl font-heading text-white">ShapeSynth</h1>
          </div>
          <div className="text-sm text-gray-400">
            Level {currentLevel?.id} - {currentLevel?.difficulty}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Match percentage */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${getMatchColor()}`}>
              {Math.round(gameState?.matchPercentage || 0)}%
            </div>
            <div className="text-xs text-gray-400">Match</div>
          </div>

          {/* Timer */}
          <div className="text-center min-w-[80px]">
            <div className="text-2xl font-bold text-white">
              {gameState?.timeRemaining || 0}s
            </div>
            <div className="text-xs text-gray-400">Time Left</div>
            <div className="w-20 h-2 bg-surface-700 rounded-full mt-1 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getTimerColor()}`}
                initial={{ width: '100%' }}
                animate={{ 
                  width: gameState ? `${(gameState.timeRemaining / currentLevel?.timeLimit) * 100}%` : '100%'
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {gameState?.score || 0}
            </div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
        </div>
      </header>

      {/* Game canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={canvasRef}
          className="w-full h-full relative bg-gradient-to-br from-surface-900 to-surface-800"
          style={{ cursor: draggedShape ? 'grabbing' : 'default' }}
        >
          {/* Target outline */}
          {currentLevel?.targetOutline && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div 
                className="border-4 border-accent target-glow"
                style={{
                  width: currentLevel.targetOutline.width,
                  height: currentLevel.targetOutline.height,
                  borderRadius: currentLevel.targetOutline.borderRadius || '0',
                  transform: `rotate(${currentLevel.targetOutline.rotation || 0}deg)`
                }}
              />
            </motion.div>
          )}

          {/* Draggable shapes */}
          <AnimatePresence>
            {shapes.map((shape, index) => (
              <motion.div
                key={shape.id}
                className={`absolute cursor-grab select-none ${
                  selectedShape === shape.id ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: shape.position.x !== null ? shape.position.x : 50 + index * 120,
                  top: shape.position.y !== null ? shape.position.y : 50,
                  transform: `rotate(${shape.rotation}deg) scale(${shape.scale})`
                }}
                drag={gameStarted && !gameOver}
                dragMomentum={false}
                onDragStart={() => setDraggedShape(shape.id)}
                onDragEnd={(event, info) => {
                  setDraggedShape(null);
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    handleShapeDrag(shape.id, {
                      x: info.point.x - rect.left,
                      y: info.point.y - rect.top
                    });
                  }
                }}
                onClick={() => handleShapeSelect(shape.id)}
                whileHover={{ scale: shape.scale * 1.1 }}
                whileDrag={{ scale: shape.scale * 1.2 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: shape.scale }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <div
                  className={`w-20 h-20 rounded-lg shadow-lg transition-all duration-500 ${
                    selectedShape === shape.id 
                      ? 'ring-4 ring-accent shape-glow' 
                      : 'shape-glow'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${
                      shape.morphStates[shape.currentMorphIndex]?.color1 || '#8B5CF6'
                    } 0%, ${
                      shape.morphStates[shape.currentMorphIndex]?.color2 || '#EC4899'
                    } 100%)`,
                    borderRadius: shape.morphStates[shape.currentMorphIndex]?.borderRadius || '8px'
                  }}
                />
                {selectedShape === shape.id && (
                  <motion.div
                    className="absolute -inset-2 border-2 border-accent rounded-xl opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Start game overlay */}
          {!gameStarted && !gameOver && !showSuccessModal && (
            <motion.div
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-xl font-heading rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Play" size={24} className="inline mr-2" />
                Start Level {currentLevel?.id}
              </motion.button>
            </motion.div>
          )}

          {/* Game over overlay */}
          {gameOver && (
            <motion.div
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-surface-800 p-8 rounded-xl border border-surface-700 text-center max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <ApperIcon name="Clock" size={48} className="text-error mx-auto mb-4" />
                <h2 className="text-2xl font-heading text-white mb-2">Time's Up!</h2>
                <p className="text-gray-400 mb-6">
                  You reached {Math.round(gameState?.matchPercentage || 0)}% accuracy
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={restartLevel}
                    className="flex-1 px-4 py-2 bg-surface-700 text-white rounded-lg border border-surface-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Success modal */}
          {showSuccessModal && (
            <motion.div
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-surface-800 p-8 rounded-xl border border-surface-700 text-center max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-4"
                >
                  <ApperIcon name="Trophy" size={48} className="text-success mx-auto" />
                </motion.div>
                <h2 className="text-2xl font-heading text-white mb-2">Perfect Match!</h2>
                <p className="text-gray-400 mb-6">
                  You achieved {Math.round(gameState?.matchPercentage || 0)}% accuracy!
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={restartLevel}
                    className="flex-1 px-4 py-2 bg-surface-700 text-white rounded-lg border border-surface-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Replay
                  </motion.button>
                  <motion.button
                    onClick={nextLevel}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-success to-primary text-white rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Level
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Control panel */}
      <div className="flex-shrink-0 h-24 bg-surface-800 border-t border-surface-700 px-6 flex items-center justify-center">
        <div className="flex items-center space-x-6">
          <motion.button
            onClick={handleShapeRotate}
            disabled={!selectedShape || !gameStarted || gameOver}
            className="px-6 py-3 bg-surface-700 text-white rounded-lg border border-surface-600 disabled:opacity-50 flex items-center space-x-2"
            whileHover={{ scale: selectedShape && gameStarted && !gameOver ? 1.05 : 1 }}
            whileTap={{ scale: selectedShape && gameStarted && !gameOver ? 0.95 : 1 }}
          >
            <ApperIcon name="RotateCw" size={20} />
            <span>Rotate</span>
          </motion.button>

          <motion.button
            onClick={() => handleShapeScale(-0.1)}
            disabled={!selectedShape || !gameStarted || gameOver}
            className="px-6 py-3 bg-surface-700 text-white rounded-lg border border-surface-600 disabled:opacity-50 flex items-center space-x-2"
            whileHover={{ scale: selectedShape && gameStarted && !gameOver ? 1.05 : 1 }}
            whileTap={{ scale: selectedShape && gameStarted && !gameOver ? 0.95 : 1 }}
          >
            <ApperIcon name="Minus" size={20} />
            <span>Shrink</span>
          </motion.button>

          <motion.button
            onClick={() => handleShapeScale(0.1)}
            disabled={!selectedShape || !gameStarted || gameOver}
            className="px-6 py-3 bg-surface-700 text-white rounded-lg border border-surface-600 disabled:opacity-50 flex items-center space-x-2"
            whileHover={{ scale: selectedShape && gameStarted && !gameOver ? 1.05 : 1 }}
            whileTap={{ scale: selectedShape && gameStarted && !gameOver ? 0.95 : 1 }}
          >
            <ApperIcon name="Plus" size={20} />
            <span>Grow</span>
          </motion.button>

          <motion.button
            onClick={restartLevel}
            disabled={!gameStarted}
            className="px-6 py-3 bg-gradient-to-r from-warning to-error text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
            whileHover={{ scale: gameStarted ? 1.05 : 1 }}
            whileTap={{ scale: gameStarted ? 0.95 : 1 }}
          >
            <ApperIcon name="RotateCcw" size={20} />
            <span>Restart</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;