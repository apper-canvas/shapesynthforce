import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { gameStateService, levelService, shapeService, hintService } from '@/services';
import Loader from '@/components/atoms/Loader';
import GameHeader from '@/components/organisms/GameHeader';
import GameCanvas from '@/components/organisms/GameCanvas';
import ControlPanel from '@/components/organisms/ControlPanel';
import GameOverlay from '@/components/organisms/GameOverlay';
import HintOverlay from '@/components/organisms/HintOverlay';

const GameFeature = () => {
    const [gameState, setGameState] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [shapes, setShapes] = useState([]);
    const [selectedShape, setSelectedShape] = useState(null);
    const [draggedShape, setDraggedShape] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [showHint, setShowHint] = useState(false);
    const [currentHint, setCurrentHint] = useState(null);
    const canvasRef = useRef(null);
    const timerRef = useRef(null);
    const morphTimerRef = useRef(null);
    const hintTimerRef = useRef(null);
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

        const placedShapes = shapes.filter(shape => shape.position.x !== null);
        if (!placedShapes.length) return 0;

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

    const startGame = useCallback(() => {
        setGameStarted(true);
        setGameOver(false);
        setShowSuccessModal(false);
    }, []);

const restartLevel = useCallback(async () => {
        try {
            const levelShapes = await shapeService.getByLevel(currentLevel.id);
            const resetState = await gameStateService.resetLevel(currentLevel.id);

            setShapes(levelShapes);
            setGameState(resetState);
            setGameOver(false);
            setShowSuccessModal(false);
            setSelectedShape(null);
            setDraggedShape(null);
            setGameStarted(false);
            setHintsRemaining(3);
            setShowHint(false);
            setCurrentHint(null);
        } catch (error) {
            toast.error('Failed to restart level');
        }
    }, [currentLevel]);

const nextLevel = useCallback(async () => {
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
            setHintsRemaining(3);
            setShowHint(false);
            setCurrentHint(null);
        } catch (error) {
            toast.error('No more levels available');
            setShowSuccessModal(false);
        }
    }, [currentLevel]);

    const handleShapeSelect = useCallback((shapeId) => {
        setSelectedShape(shapeId);
    }, []);

    const handleShapeDrag = useCallback((shapeId, position) => {
        setShapes(prev => prev.map(shape =>
            shape.id === shapeId
                ? { ...shape, position }
                : shape
        ));
    }, []);

    const handleShapeRotate = useCallback(() => {
        if (!selectedShape) return;

        setShapes(prev => prev.map(shape =>
            shape.id === selectedShape
                ? { ...shape, rotation: (shape.rotation + 15) % 360 }
                : shape
        ));
    }, [selectedShape]);

    const handleShapeScale = useCallback((delta) => {
        if (!selectedShape) return;

        setShapes(prev => prev.map(shape =>
            shape.id === selectedShape
                ? {
                    ...shape,
                    scale: Math.max(0.5, Math.min(2, shape.scale + delta))
                }
                : shape
        ));
    }, [selectedShape]);

    const getTimerColor = useCallback(() => {
        if (!gameState || !currentLevel) return 'from-info to-primary';
        const percentage = (gameState.timeRemaining / currentLevel.timeLimit) * 100;
        if (percentage > 50) return 'from-info to-primary';
        if (percentage > 25) return 'from-warning to-error';
        return 'from-error to-error';
    }, [gameState, currentLevel]);

    const getMatchColor = useCallback(() => {
        if (!gameState || !currentLevel) return 'text-gray-400';
        const percentage = gameState.matchPercentage;
        if (percentage >= currentLevel.requiredAccuracy) return 'text-success';
        if (percentage >= 50) return 'text-warning';
        return 'text-error';
}, [gameState, currentLevel]);

const handleUseHint = useCallback(async () => {
        if (hintsRemaining <= 0) {
            toast.warning('No hints remaining for this level!');
            return;
        }
        
        if (!selectedShape) {
            toast.warning('Please select a shape first to get a hint.');
            return;
        }
        
        if (!currentLevel) {
            toast.error('Level not loaded. Please restart the game.');
            return;
        }

        try {
            toast.info('Getting hint...', { autoClose: 1000 });
            const hint = await hintService.getOptimalSolution(currentLevel.id, selectedShape);
            
            if (!hint || !hint.optimalPosition) {
                toast.error('Invalid hint data received.');
                return;
            }
            
            setCurrentHint(hint);
            setShowHint(true);
            setHintsRemaining(prev => prev - 1);

            // Auto-hide hint after 4 seconds (longer for better visibility)
            if (hintTimerRef.current) {
                clearTimeout(hintTimerRef.current);
            }
            hintTimerRef.current = setTimeout(() => {
                setShowHint(false);
                setCurrentHint(null);
            }, 4000);

            toast.success(`Hint displayed! ${hintsRemaining - 1} hints remaining.`, { autoClose: 2000 });
        } catch (error) {
            console.error('Hint error:', error);
            toast.error('Failed to get hint. Please try again.');
        }
    }, [hintsRemaining, selectedShape, currentLevel]);

    // Cleanup hint timer
    useEffect(() => {
        return () => {
            if (hintTimerRef.current) {
                clearTimeout(hintTimerRef.current);
            }
        };
    }, []);
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="h-screen bg-surface-900 flex flex-col overflow-hidden">
            <GameHeader
                currentLevel={currentLevel}
                gameState={gameState}
                getMatchColor={getMatchColor}
                getTimerColor={getTimerColor}
            />

            <GameCanvas
                canvasRef={canvasRef}
                shapes={shapes}
                selectedShape={selectedShape}
                draggedShape={draggedShape}
                setDraggedShape={setDraggedShape}
                currentLevel={currentLevel}
                gameStarted={gameStarted}
                gameOver={gameOver}
                onShapeSelect={handleShapeSelect}
                onShapeDragEnd={handleShapeDrag}
            />

<ControlPanel
                selectedShape={selectedShape}
                gameStarted={gameStarted}
                gameOver={gameOver}
                hintsRemaining={hintsRemaining}
                onRotate={handleShapeRotate}
                onShrink={() => handleShapeScale(-0.1)}
                onGrow={() => handleShapeScale(0.1)}
                onRestartLevel={restartLevel}
                onUseHint={handleUseHint}
            />

            <HintOverlay
                isVisible={showHint}
                hint={currentHint}
                onClose={() => {
                    setShowHint(false);
                    setCurrentHint(null);
                }}
            />
            <GameOverlay
                type="start"
                isVisible={!gameStarted && !gameOver && !showSuccessModal}
                currentLevel={currentLevel}
                onStartGame={startGame}
            />

            <GameOverlay
                type="game_over"
                isVisible={gameOver}
                gameState={gameState}
                onRestartLevel={restartLevel}
            />

            <GameOverlay
                type="success"
                isVisible={showSuccessModal}
                gameState={gameState}
                currentLevel={currentLevel}
                onRestartLevel={restartLevel}
                onNextLevel={nextLevel}
            />
        </div>
    );
};

export default GameFeature;