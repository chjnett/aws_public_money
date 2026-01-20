
import React, { useState, useRef } from 'react';

interface InteractiveCardProps {
    jeju: string;
    kr: string;
    type: string;
    difficulty: string;
    root?: string;
    illustration: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ jeju, kr, type, difficulty, root, illustration }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        setRotate({ x: rotateX, y: rotateY });
        setGlare({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 0.4
        });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    // Simplified Jeju Icon set based on keywords
    const getJejuIcon = (illust: string) => {
        switch (illust) {
            case 'dolhareubang': return '🗿';
            case 'tangerine': return '🍊';
            case 'hallasan': return '⛰️';
            case 'sea': return '🌊';
            case 'house': return '🏠';
            case 'haenyeo': return '🏊‍♀️';
            default: return '🌴';
        }
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-64 transition-transform duration-200 ease-out preserve-3d"
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            }}
        >
            <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col p-6 group">
                {/* Holographic Glare Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, transparent 60%), 
                        linear-gradient(135deg, rgba(255,165,0,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,191,255,0.1) 100%)`,
                        opacity: glare.opacity
                    }}
                />

                <div className="flex justify-between items-start z-10">
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                        {type}
                    </span>
                    <span className="text-xs font-bold text-slate-300">#{difficulty}</span>
                </div>

                <div className="mt-4 flex-grow z-10">
                    <h3 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{jeju}</h3>
                    <p className="text-slate-500 font-medium">{kr}</p>
                    {root && (
                        <div className="mt-4 inline-block text-[11px] font-bold bg-slate-900 text-white px-3 py-1 rounded-lg">
                            뿌리: {root}
                        </div>
                    )}
                </div>

                {/* Floating "Pokemon" Style Illustration */}
                <div className="absolute right-[-10px] bottom-[-10px] text-[120px] opacity-20 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 pointer-events-none select-none filter drop-shadow-2xl">
                    {getJejuIcon(illustration)}
                </div>
            </div>
        </div>
    );
};
