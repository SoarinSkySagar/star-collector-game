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
import React from 'react'

export default function 
Register() {
  return (
    <div>
        <RegisterUser/>
    </div>
  )
}

