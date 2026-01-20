
export type QuizType = 'TRANSLATION' | 'ROOT' | 'POS' | 'ASSEMBLY' | 'NATURALNESS';
export type Difficulty = 'L1' | 'L2' | 'L3' | 'L4';

export interface Quiz {
    id: string;
    type: QuizType;
    difficulty: Difficulty;
    question: string;
    subQuestion?: string;
    options?: string[]; // For multiple choice
    answer: string | string[]; // String for MC, Array for Assembly
    explanation: {
        meaning: string;
        root?: string;
        pos?: string;
        nuance?: string;
    };
    sentence_kr: string;
    sentence_jeju: string;
}

export type AppMode = 'LEARN' | 'EXPLORE' | 'AI_GENERATOR';
