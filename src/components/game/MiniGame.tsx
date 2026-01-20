
import React, { useState } from 'react';
import { Game } from './Game';
import { InteractiveCard } from './InteractiveCard';
import { Flashcards } from './Flashcards';
import { INITIAL_QUIZZES } from './constants';
import { AppMode, Quiz } from './types';
import { GeminiService } from '@/services/geminiService';
import { X, ExternalLink, RefreshCw } from 'lucide-react';

interface MiniGameProps {
    onClose: () => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ onClose }) => {
    const [mode, setMode] = useState<AppMode>('LEARN');
    const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
    const [loading, setLoading] = useState(false);

    const handleGenerateMore = async () => {
        setLoading(true);
        const service = new GeminiService();
        const more = await service.generateQuizzes(5);
        if (more.length > 0) {
            setQuizzes(prev => [...prev, ...more]);
        } else {
            alert("퀴즈를 생성하는 데 실패했습니다. (API 키를 확인해주세요)");
        }
        setLoading(false);
    };

    // Assign deterministic illustrations for initial set
    const getIllust = (id: string) => {
        const illusts = ['dolhareubang', 'tangerine', 'hallasan', 'sea', 'house', 'haenyeo'];
        const idx = parseInt(id.replace(/\D/g, '') || '0') % illusts.length;
        return illusts[idx];
    };

    const ExplorerMode = () => (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95">
                {quizzes.map(q => (
                    <InteractiveCard
                        key={q.id}
                        jeju={q.sentence_jeju}
                        kr={q.sentence_kr}
                        type={q.type}
                        difficulty={q.difficulty}
                        root={q.explanation.root}
                        illustration={getIllust(q.id)}
                    />
                ))}
            </div>

            <Flashcards quizzes={quizzes} />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#f8fafc] w-full max-w-5xl h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">

                {/* Header / Navbar */}
                <div className="bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🍊</span>
                        <h1 className="text-xl font-bold text-slate-800">Tamra Talk <span className="text-orange-500 text-sm ml-2">Mini</span></h1>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">

                    {/* Today's Dialect Banner */}
                    <div className="mb-12 relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 group">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-50 text-orange-200" />
                        <div className="relative z-10 flex-shrink-0">
                            <div className="relative">
                                <span className="absolute -top-6 -right-2 text-3xl rotate-12 drop-shadow-sm">👑</span>
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center text-3xl text-white transform group-hover:rotate-6 transition-transform">
                                    🍊
                                </div>
                            </div>
                        </div>
                        <div className="z-10 text-center md:text-left flex-1">
                            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">오늘의 방언</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">지꺼지게 맛좋수다</h2>
                            <p className="text-slate-500 font-medium text-sm">기분 좋게 맛있네요! (Happy eating!)</p>
                        </div>
                        <div className="flex flex-col items-center md:items-end z-10">
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest mb-1">Master Status</span>
                            <span className="text-xl font-black text-slate-800">LV. {Math.floor(quizzes.length / 5)}</span>
                        </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex justify-center mb-10 bg-white p-1.5 rounded-[2rem] w-fit mx-auto shadow-sm border border-slate-100">
                        <button
                            onClick={() => setMode('LEARN')}
                            className={`px-6 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all ${mode === 'LEARN' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            챌린지
                        </button>
                        <button
                            onClick={() => setMode('EXPLORE')}
                            className={`px-6 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all ${mode === 'EXPLORE' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            학습 & 카드
                        </button>
                        <button
                            onClick={() => setMode('AI_GENERATOR')}
                            className={`px-6 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all ${mode === 'AI_GENERATOR' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            AI 확장
                        </button>
                    </div>

                    {/* Content based on Mode */}
                    {mode === 'LEARN' && (
                        <Game quizzes={quizzes} onComplete={() => setMode('EXPLORE')} />
                    )}

                    {mode === 'EXPLORE' && (
                        <ExplorerMode />
                    )}

                    {mode === 'AI_GENERATOR' && (
                        <div className="bg-white rounded-[3rem] p-10 shadow-lg text-center max-w-lg mx-auto border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                                ✨
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">AI 퀴즈 메이커</h2>
                            <p className="text-slate-500 mb-8 text-base leading-relaxed">
                                Gemini AI가 당신의 학습 수준을 분석하여<br />
                                <span className="font-bold text-orange-500">뿌리 깊은 방언 퀴즈</span>를 설계합니다.
                            </p>
                            <button
                                onClick={handleGenerateMore}
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-bold text-lg shadow-xl hover:bg-black disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        <span>문항 설계 중...</span>
                                    </>
                                ) : '새로운 심화 퀴즈 5개 추가'}
                            </button>
                        </div>
                    )}

                    <div className="h-12"></div> {/* Bottom Spacer */}
                </div>
            </div>
        </div>
    );
};

export default MiniGame;
