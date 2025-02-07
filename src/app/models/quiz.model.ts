import { Question } from './question.model';

export interface Quiz {
  quizId: string;
  questions: Question[]; // Add a list of questions to the story
}
