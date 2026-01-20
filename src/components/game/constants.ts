
import { Quiz } from './types';

export const INITIAL_QUIZZES: Quiz[] = [
    {
        id: "q1",
        type: "ASSEMBLY",
        difficulty: "L1",
        question: "표준어: '어서 오세요.'",
        sentence_kr: "어서 오세요.",
        sentence_jeju: "혼저 옵서예.",
        answer: ["혼저", "옵서예."],
        explanation: {
            meaning: "제주도의 가장 대표적인 환영 인사입니다.",
            root: "혼저 (어서), 옵다 (오다)",
            pos: "부사, 동사"
        }
    },
    {
        id: "q2",
        type: "ROOT",
        difficulty: "L2",
        question: "'폭싹 속았다'에서 '속았다'의 실제 의미는?",
        options: ["속임을 당했다", "수고하셨다", "화가 났다", "기다렸다"],
        answer: "수고하셨다",
        sentence_kr: "매우 수고하셨습니다.",
        sentence_jeju: "폭싹 속았수다.",
        explanation: {
            meaning: "'속다'는 표준어와 달리 '수고하다'라는 뜻의 고어 형태가 남은 것입니다.",
            root: "속다 (수고하다)",
            pos: "동사"
        }
    },
    {
        id: "q3",
        type: "POS",
        difficulty: "L1",
        question: "다음 단어의 품사는 무엇일까요?",
        subQuestion: "'요망지다' (야무지다/똑똑하다)",
        options: ["명사", "동사", "형용사", "부사"],
        answer: "형용사",
        sentence_kr: "아이가 참 야무지네요.",
        sentence_jeju: "아이가 하영 요망지우다.",
        explanation: {
            meaning: "상태나 성질을 나타내는 형용사입니다.",
            root: "요망지- (야무지다)",
            pos: "형용사"
        }
    },
    {
        id: "q4",
        type: "TRANSLATION",
        difficulty: "L3",
        question: "'놀멍 놀멍 옵서'를 가장 정확하게 해석한 것은?",
        options: ["놀면서 오세요", "천천히 여유있게 오세요", "놀다가 가세요", "빨리 뛰어오세요"],
        answer: "천천히 여유있게 오세요",
        sentence_kr: "천천히 오세요.",
        sentence_jeju: "놀멍 놀멍 옵서.",
        explanation: {
            meaning: "'놀멍'은 '놀면서'라는 뜻이지만 실제로는 서두르지 말고 천천히 오라는 정서가 담겨 있습니다.",
            root: "놀멍 (놀면서/천천히)",
            nuance: "제주 특유의 여유를 나타내는 표현"
        }
    }
];
