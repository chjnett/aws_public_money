
import React from 'react';

const Spoon: React.FC = () => {
    return (
        <div className="w-[280px] h-36 animate-spoon flex items-start justify-center">
            <svg
                viewBox="0 0 300 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl overflow-visible"
            >
                <defs>
                    {/* 따뜻한 느낌의 나무 질감 그라데이션 */}
                    <linearGradient id="wood_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D2B48C" />
                        <stop offset="30%" stopColor="#C19A6B" />
                        <stop offset="60%" stopColor="#A0522D" />
                        <stop offset="100%" stopColor="#8B4513" />
                    </linearGradient>

                    <radialGradient id="wood_bowl_depth" cx="45%" cy="40%" r="65%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                    </radialGradient>
                </defs>

                {/* Shortened Wooden Handle (1/2 length) */}
                <path
                    d="M160 65 C 200 60, 260 75, 285 100 C 295 110, 290 120, 275 120 C 240 120, 200 85, 160 80 Z"
                    fill="url(#wood_gradient)"
                />

                {/* Enlarged Wooden Spoon Head (Deep Bowl) */}
                <path
                    d="M10 55 C 10 130, 180 130, 180 55 C 180 15, 10 15, 10 55 Z"
                    fill="url(#wood_gradient)"
                />

                {/* Depth shadow inside the larger bowl */}
                <path
                    d="M25 55 C 25 115, 165 115, 165 55 C 165 30, 25 30, 25 55 Z"
                    fill="url(#wood_bowl_depth)"
                    fillOpacity="0.6"
                />

                {/* Surface grain detail */}
                <path
                    d="M40 40 C 75 33, 115 33, 150 40"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeOpacity="0.1"
                />
            </svg>
        </div>
    );
};

export default Spoon;
