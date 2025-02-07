import { QuizResult } from './quiz-results-model';
import { Question } from './question.model';

export class Score {
  userId: string | undefined;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  totalScore: number;
  percentage: number;
  quizId: string | undefined;
  url: string | undefined;
  topics: string | undefined;
  questions: Question[];

  constructor(
    userId: string | undefined,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    incorrectAnswers: number,
    skippedQuestions: number,
    totalScore: number,
    percentage: number,
    quizId: string | undefined,
    url: string | undefined,
    topics: string | undefined,
    questions: Question[]
  ) {
    this.userId = userId;
    this.score = score;
    this.totalQuestions = totalQuestions;
    this.correctAnswers = correctAnswers;
    this.incorrectAnswers = incorrectAnswers;
    this.skippedQuestions = skippedQuestions;
    this.totalScore = totalScore;
    this.percentage = percentage;
    this.quizId = quizId;
    this.url = url;
    this.topics = topics;
    this.questions = questions;
  }

  calculatePercentage(): number {
    return (this.correctAnswers / this.totalQuestions) * 100;
  }

  calculateTotalScore(): number {
    return this.correctAnswers * 10;  // Assuming 10 points per correct answer
  }

  toResultObject(): any {
    return {
      userId: this.userId,
      score: this.score,
      totalQuestions: this.totalQuestions,
      correctAnswers: this.correctAnswers,
      incorrectAnswers: this.incorrectAnswers,
      skippedQuestions: this.skippedQuestions,
      totalScore: this.totalScore,
      percentage: this.calculatePercentage(),
      quizId: this.quizId,
      url: this.url,
      topics: this.topics,
      questions: this.questions
    };
  }

  mapQuestions(results: QuizResult[]): Question[] {
    return results.map(result => ({
      questionId: parseInt(result.id, 10),  // Ensure the ID is a number
      questionText: result.question,
      answerChoices: result.choices,
      correctAnswer: result.answer,
      explanation: result.explanation || ''
    }));
  }
}
