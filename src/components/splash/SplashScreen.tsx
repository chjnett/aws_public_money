
import React, { useRef } from 'react';
import RiceGrain, { RiceGrainHandle } from './RiceGrain';
import Spoon from './Spoon';

interface SplashScreenProps {
    onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    const riceGrainRef = useRef<RiceGrainHandle>(null);
    const [grains, setGrains] = React.useState<Array<{ left: string; top: string; transform: string; animation: string }>>([]);

    React.useEffect(() => {
        setGrains([...Array(12)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `text-float ${2 + Math.random() * 2}s ease-in-out infinite alternate`
        })));
    }, []);

    const handleStart = () => {
        // 효과음 재생
        const audio = new Audio('/start-sound.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));

        // 밥풀 터지는 효과 실행
        riceGrainRef.current?.triggerBurst();

        // 밥풀 터지는 거 구경하게 1000ms 딜레이 후 이동
        setTimeout(() => {
            onStart();
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDF5] relative select-none overflow-hidden touch-none fixed inset-0 z-50">

            {/* Decorative falling grains */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {grains.map((style, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full w-2 h-4"
                        style={style}
                    />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center -mt-20 w-full flex-1">
                <div className="relative flex flex-col items-center">
                    {/* 
              RiceGrain Positioning Adjustments:
              - mb: Reduced from -100px to -80px to raise the grain's resting position.
              - mr: Increased from 100px to 110px to perfectly align with the center of the large spoon head.
          */}
                    <div className="relative mb-[-80px] z-10 mr-[110px]">
                        <RiceGrain ref={riceGrainRef} />
                    </div>

                    {/* Compact Stubby Wooden Spoon */}
                    <Spoon />
                </div>

                {/* Branding Name */}
                <div className="text-center animate-branding mt-16 mb-12">
                    <h1 className="text-5xl font-bold text-[#8B4513] tracking-widest drop-shadow-sm">
                        밥풀
                    </h1>
                    <p className="text-sm text-stone-400 mt-2 font-sans tracking-[0.2em] font-medium uppercase">
                        AI Meal Recommendation
                    </p>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    className="bg-[#8B4513] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#723a0f] hover:scale-105 active:scale-95 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 delay-300"
                >
                    시작하기
                </button>
            </div>

            {/* Mobile Bottom Home Indicator (Decoration) */}
            <div className="absolute bottom-2 w-36 h-1.5 bg-stone-200 rounded-full opacity-50"></div>
        </div>
    );
};

export default SplashScreen;
