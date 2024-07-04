"use client"

import { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';

const Game = () => {
    const gameRef = useGame();
    const gameContainerRef = useRef(null);

    useEffect(() => {
        if (gameRef.current && gameContainerRef.current) {
            gameRef.current.canvas.parentNode.removeChild(gameRef.current.canvas);
            gameContainerRef.current.appendChild(gameRef.current.canvas);
        }
    }, [gameRef]);

    return (
        <div ref={gameContainerRef} />
    );
};

export default Game;
