import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, TICK_RATE } from '../constants';
import { Point, Direction } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, TICK_RATE);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-sm px-4 py-2 border border-cyan-500/30 rounded-lg bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cyan-400">
          <Trophy className="w-4 h-4" />
          <span className="font-mono text-xl">{score.toString().padStart(4, '0')}</span>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
        </button>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-zinc-950 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        style={{ 
          width: 'min(90vw, 400px)', 
          height: 'min(90vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)',
               backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`
             }} 
        />

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layout
            initial={false}
            className={`rounded-sm ${i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600/80'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="text-4xl font-display text-pink-500 glitch-text mb-4">GAME OVER</h2>
              <p className="text-zinc-400 mb-6 font-mono">FINAL SCORE: {score}</p>
              <button
                onClick={resetGame}
                className="group flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all active:scale-95"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                RETRY
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {!gameOver && isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="w-20 h-20 flex items-center justify-center bg-cyan-500/20 border-2 border-cyan-500 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all group"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
              </button>
              <p className="mt-4 text-cyan-400 font-mono tracking-widest uppercase">Paused</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-zinc-500 text-xs font-mono text-center max-w-xs leading-relaxed">
        USE ARROW KEYS TO MOVE<br />
        SPACE TO PAUSE / RESUME
      </div>
    </div>
  );
};
