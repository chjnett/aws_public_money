
import React, { useState, useCallback } from 'react';

interface MiniGrainData {
    id: number;
    x: number;
    y: number;
    rotation: number;
    type: number; // 0: 행복, 1: 윙크, 2: 깜짝
}

const RiceGrain: React.FC = () => {
    const [miniGrains, setMiniGrains] = useState<MiniGrainData[]>([]);

    const handleBurst = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();

        const newGrains: MiniGrainData[] = [];
        const count = 14;
        const now = Date.now();

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 360 - 180 + (Math.random() * 40 - 20);
            const distance = 140 + Math.random() * 100;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance - 60;
            const rotation = Math.random() * 1080 - 540;
            const type = Math.floor(Math.random() * 3); // 무작위 표정 선택

            newGrains.push({
                id: now + i,
                x,
                y,
                rotation,
                type,
            });
        }

        setMiniGrains((prev) => [...prev, ...newGrains]);

        setTimeout(() => {
            setMiniGrains((prev) => prev.filter(g => !newGrains.some(n => n.id === g.id)));
        }, 1200);
    }, []);

    const renderMiniFace = (type: number) => {
        const scale = "scale(0.7)";

        return (
            <div className="relative flex flex-col items-center pointer-events-none" style={{ transform: scale }}>
                {/* 눈 레이어 */}
                <div className="flex gap-2 mb-1">
                    {type === 0 && ( // 행복한 표정 (^ ^)
                        <>
                            <div className="w-1.5 h-1 border-t-2 border-stone-800 rounded-full"></div>
                            <div className="w-1.5 h-1 border-t-2 border-stone-800 rounded-full"></div>
                        </>
                    )}
                    {type === 1 && ( // 윙크 (; ^)
                        <>
                            <div className="w-1.5 h-1.5 bg-stone-800 rounded-full"></div>
                            <div className="w-1.5 h-[2px] bg-stone-800 rounded-full mt-1"></div>
                        </>
                    )}
                    {type === 2 && ( // 깜짝 (o o)
                        <>
                            <div className="w-1.5 h-1.5 bg-stone-800 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-stone-800 rounded-full"></div>
                        </>
                    )}
                </div>

                {/* 입 레이어 */}
                <div className={`w-3 h-1.5 border-b-2 border-stone-800 rounded-full ${type === 2 ? 'bg-stone-800 h-1.5 rounded-full border-none' : ''}`}></div>

                {/* 미니 볼터치 */}
                <div className="absolute top-1.5 flex justify-between w-6 px-0.5 opacity-60">
                    <div className="w-1.5 h-1 bg-rose-300 rounded-full blur-[1px]"></div>
                    <div className="w-1.5 h-1 bg-rose-300 rounded-full blur-[1px]"></div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative group">
            {/* 1. 미니 밥풀 레이어 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                {miniGrains.map((grain) => (
                    <div
                        key={grain.id}
                        className="absolute mini-grain-burst bg-white border-2 border-stone-300 rounded-[55%_55%_48%_48%] shadow-md flex items-center justify-center overflow-hidden"
                        style={{
                            width: '24px',
                            height: '32px',
                            '--x': `${grain.x}px`,
                            '--y': `${grain.y}px`,
                            '--r': `${grain.rotation}deg`,
                        } as React.CSSProperties}
                    >
                        {renderMiniFace(grain.type)}
                    </div>
                ))}
            </div>

            {/* 2. 메인 캐릭터 본체 */}
            <div className="relative w-24 h-32 flex items-center justify-center animate-rice origin-bottom z-20 pointer-events-none">
                <div className="absolute inset-0 bg-white rounded-[50%_50%_45%_45%] shadow-md border-2 border-stone-100"></div>

                <div className="relative z-30 flex flex-col items-center gap-3">
                    <div className="flex gap-4">
                        <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-stone-800 rounded-full animate-wink origin-center"></div>
                    </div>
                    <div className="w-4 h-2 border-b-2 border-stone-800 rounded-full mt-1"></div>
                </div>

                <div className="absolute z-30 flex w-full justify-between px-4 bottom-12">
                    <div className="w-3 h-2 bg-rose-200 blur-[2px] rounded-full"></div>
                    <div className="w-3 h-2 bg-rose-200 blur-[2px] rounded-full"></div>
                </div>
            </div>

            {/* 3. 투명 클릭 레이어 */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[220px] cursor-pointer z-50 rounded-full"
                onClick={handleBurst}
                style={{ transform: 'translateX(-50%) translateY(30px)' }}
            ></div>
        </div>
    );
};

export default RiceGrain;
