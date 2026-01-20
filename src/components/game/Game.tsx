
import React, { useState, useEffect, useMemo } from 'react';
import { Quiz } from './types';

interface GameProps {
    quizzes: Quiz[];
    onComplete: () => void;
}

export const Game: React.FC<GameProps> = ({ quizzes, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedChunks, setSelectedChunks] = useState<string[]>([]); // For ASSEMBLY
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // For MC
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const currentQuiz = quizzes[currentIndex];

    const shuffledAssemblyOptions = useMemo(() => {
        if (currentQuiz?.type === 'ASSEMBLY') {
            const chunks = Array.isArray(currentQuiz.answer) ? currentQuiz.answer : [];
            return [...chunks].sort(() => Math.random() - 0.5);
        }
        return [];
    }, [currentQuiz]);

    const [assemblyPool, setAssemblyPool] = useState<string[]>([]);

    useEffect(() => {
        setAssemblyPool(shuffledAssemblyOptions);
        setSelectedChunks([]);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsCorrect(null);
    }, [currentIndex, shuffledAssemblyOptions]);

    const handleAssemblySelect = (chunk: string) => {
        setSelectedChunks(prev => [...prev, chunk]);
        setAssemblyPool(prev => {
            const idx = prev.indexOf(chunk);
            const next = [...prev];
            next.splice(idx, 1);
            return next;
        });
    };

    const handleAssemblyRemove = (chunk: string) => {
        setSelectedChunks(prev => {
            const idx = prev.lastIndexOf(chunk);
            const next = [...prev];
            next.splice(idx, 1);
            return next;
        });
        setAssemblyPool(prev => [...prev, chunk]);
    };

    const handleCheck = () => {
        let correct = false;
        if (currentQuiz.type === 'ASSEMBLY') {
            const userAns = selectedChunks.join(' ');
            const targetAns = (currentQuiz.answer as string[]).join(' ');
            correct = userAns === targetAns;
        } else {
            correct = selectedOption === currentQuiz.answer;
        }

        setIsCorrect(correct);
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentIndex < quizzes.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    if (!currentQuiz) return null;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 transition-all border border-slate-100 max-w-2xl mx-auto">
            {/* Header Info */}
            <div className="mb-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${currentQuiz.difficulty === 'L4' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                        {currentQuiz.type} • {currentQuiz.difficulty}
                    </span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                    QUEST {currentIndex + 1} / {quizzes.length}
                </div>
            </div>

            {/* Question Area */}
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {currentQuiz.question}
                </h2>
                {currentQuiz.subQuestion && (
                    <p className="mt-4 text-orange-500 font-bold text-lg bg-orange-50 inline-block px-4 py-1 rounded-xl">
                        {currentQuiz.subQuestion}
                    </p>
                )}
            </div>

            {/* Main interaction Area */}
            <div className="mb-10">
                {currentQuiz.type === 'ASSEMBLY' ? (
                    <div className="space-y-6">
                        <div className="flex flex-wrap justify-center gap-3 min-h-[70px] p-5 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                            {selectedChunks.map((chunk, idx) => (
                                <button
                                    key={`${idx}-${chunk}`}
                                    disabled={isAnswered}
                                    onClick={() => handleAssemblyRemove(chunk)}
                                    className="bg-orange-500 text-white px-5 py-2.5 rounded-2xl font-bold shadow-md hover:bg-orange-600 transition-all active:scale-95"
                                >
                                    {chunk}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {assemblyPool.map((chunk, idx) => (
                                <button
                                    key={`${idx}-${chunk}`}
                                    disabled={isAnswered}
                                    onClick={() => handleAssemblySelect(chunk)}
                                    className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl font-bold hover:border-orange-300 hover:text-orange-500 transition-all active:scale-95"
                                >
                                    {chunk}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {currentQuiz.options?.map((option, idx) => (
                            <button
                                key={idx}
                                disabled={isAnswered}
                                onClick={() => setSelectedOption(option)}
                                className={`w-full py-4 px-6 rounded-2xl font-semibold text-left border-2 transition-all flex items-center justify-between ${selectedOption === option
                                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-inner'
                                        : 'border-slate-100 hover:border-orange-200 hover:bg-slate-50 text-slate-600'
                                    } ${isAnswered && option === currentQuiz.answer ? '!border-green-500 !bg-green-50 !text-green-700' : ''}`}
                            >
                                <span>{option}</span>
                                {selectedOption === option && <span className="text-orange-500">●</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Feedback & Navigation */}
            <div className="space-y-4">
                {!isAnswered ? (
                    <button
                        disabled={(currentQuiz.type === 'ASSEMBLY' ? selectedChunks.length === 0 : !selectedOption)}
                        onClick={handleCheck}
                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold text-xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-30"
                    >
                        확인하기
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className={`p-6 rounded-3xl mb-6 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
                                <h3 className={`font-bold text-xl ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                    {isCorrect ? '정답입니다!' : '아쉽네요, 다시 살펴볼까요?'}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-white/60 p-4 rounded-2xl">
                                    <p className="text-slate-700 font-medium mb-1">문장 해설</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">{currentQuiz.explanation.meaning}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {currentQuiz.explanation.root && (
                                        <div className="bg-white/60 p-3 rounded-xl">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">뿌리 (Root)</p>
                                            <p className="text-slate-700 font-bold text-sm">{currentQuiz.explanation.root}</p>
                                        </div>
                                    )}
                                    {currentQuiz.explanation.pos && (
                                        <div className="bg-white/60 p-3 rounded-xl">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">품사 (POS)</p>
                                            <p className="text-slate-700 font-bold text-sm">{currentQuiz.explanation.pos}</p>
                                        </div>
                                    )}
                                </div>

                                {currentQuiz.explanation.nuance && (
                                    <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-100">
                                        <p className="text-[10px] uppercase font-bold text-orange-400 mb-1">어감 (Nuance)</p>
                                        <p className="text-orange-700 font-medium text-sm italic">"{currentQuiz.explanation.nuance}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-5 bg-orange-500 text-white rounded-3xl font-bold text-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                        >
                            다음 문제로
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
