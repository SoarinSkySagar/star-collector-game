import { GameProvider } from '@/context/GameContext';
import Game from '@/components/Game';

export default function Home() {
    return (
        <GameProvider>
            <Game />
        </GameProvider>
    );
}
