// import dynamic from 'next/dynamic';
// import { GameProvider } from '@/context/GameContext';

// const DynamicGame = dynamic(() => import('@/components/Game'), { ssr: false });

// export default function Home() {
//     return (
//         <GameProvider>
//             <DynamicGame />
//         </GameProvider>
//     );
// }

import RegisterUser from '@/components/ConnectButton'
import PixelTrailCanvas from '@/components/Pixeltrail'

export default function 
Register() {
  return (
    <div>
        <PixelTrailCanvas
            pixelSize={45}
            pixelColor="255, 0, 0"
            fadeSpeed={0.01}
            trailDuration={50}
        />
        <RegisterUser style={{ position: 'relative', zIndex: 1 }} />
    </div>
  )
}

