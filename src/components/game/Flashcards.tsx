
import React, { useState } from 'react';
import { Quiz } from './types';

interface FlashcardProps {
    quizzes: Quiz[];
}

export const Flashcards: React.FC<FlashcardProps> = ({ quizzes }) => {
    const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

    const toggleFlip = (id: string) => {
        const next = new Set(flippedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setFlippedIds(next);
    };

    // Limit to 20 cards for study session
    const studySet = quizzes.slice(0, 20);

    return (
        <div className="mt-20 border-t border-slate-200 pt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">단어 플래시카드 📇</h2>
                    <p className="text-slate-500 text-sm">클릭해서 뜻을 확인해보세요 (20개씩 학습)</p>
                </div>
                <div className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold">
                    {studySet.length} CARDS
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {studySet.map((q) => (
                    <div
                        key={q.id}
                        onClick={() => toggleFlip(q.id)}
                        className="group h-40 [perspective:1000px] cursor-pointer"
                    >
                        <div className={`relative h-full w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] ${flippedIds.has(q.id) ? '[transform:rotateY(180deg)]' : ''}`}>
                            {/* Front: Jeju */}
                            <div className="absolute inset-0 h-full w-full rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center p-4 text-center [backface-visibility:hidden]">
                                <p className="font-bold text-slate-800 text-sm">{q.sentence_jeju}</p>
                            </div>
                            {/* Back: KR */}
                            <div className="absolute inset-0 h-full w-full rounded-2xl bg-orange-500 text-white flex items-center justify-center p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <p className="font-bold text-sm leading-tight">{q.sentence_kr}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
