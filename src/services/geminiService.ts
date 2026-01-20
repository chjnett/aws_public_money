
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from "../components/game/types";

export class GeminiService {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
    }

    async generateQuizzes(count: number = 5): Promise<Quiz[]> {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: `제주도 방언 학습 퀴즈를 ${count}개 생성해줘. 다음 규칙을 엄격히 준수할 것:

1. 퀴즈 타입 라이브러리:
   - TRANSLATION: 4지선다 번역 (뉘앙스 차이 강조)
   - ROOT: 어근/뿌리 의미 파악 (고어 형태 위주)
   - POS: 품사 판별 (명/형/동/부)
   - ASSEMBLY: 문장 조합 (S/M/L 길이 다양화)
   - NATURALNESS: 가장 자연스러운 방언 선택

2. 난이도 기준:
   - 어근(L1-L4): 기본형부터 형태 유사 함정까지 사용
   - 선택지(D1-D3): 의미가 비슷하지만 문맥상 틀린 오답 설계 (매우 까다롭게)

3. 필수 포함 데이터:
   - explanation 객체에 'meaning', 'root', 'pos', 'nuance' 상세 설명 포함.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['TRANSLATION', 'ROOT', 'POS', 'ASSEMBLY', 'NATURALNESS'] },
                                difficulty: { type: Type.STRING, enum: ['L1', 'L2', 'L3', 'L4'] },
                                question: { type: Type.STRING },
                                subQuestion: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                answer: { type: Type.STRING, description: "MC의 경우 문자열, ASSEMBLY의 경우 문자열을 띄어쓰기로 합친 것" },
                                sentence_kr: { type: Type.STRING },
                                sentence_jeju: { type: Type.STRING },
                                explanation: {
                                    type: Type.OBJECT,
                                    properties: {
                                        meaning: { type: Type.STRING },
                                        root: { type: Type.STRING },
                                        pos: { type: Type.STRING },
                                        nuance: { type: Type.STRING }
                                    }
                                }
                            },
                            required: ["type", "difficulty", "question", "answer", "explanation", "sentence_kr", "sentence_jeju"]
                        }
                    }
                }
            });

            const data = JSON.parse(response?.text || '[]');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.map((item: any, index: number) => {
                // Post-process assembly answer to array if string
                let finalAnswer = item.answer;
                if (item.type === 'ASSEMBLY' && typeof item.answer === 'string') {
                    finalAnswer = item.sentence_jeju.replace(/[.?!]/g, '').split(' ');
                }

                return {
                    ...item,
                    answer: finalAnswer,
                    id: `gen-${Date.now()}-${index}`
                };
            });
        } catch (error) {
            console.error("Gemini Generation Error:", error);
            return [];
        }
    }
}
