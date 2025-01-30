export interface QuizResult {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  userAnswer: string | null; // Store user's answer
  isCorrect: boolean; // Store correctness of the answer
  explanation: string;
}

