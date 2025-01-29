import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizResult } from '../models/quiz-results-model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  // Observable for questions
  private questionsSubject = new BehaviorSubject<any[]>([]);
  questions$ = this.questionsSubject.asObservable();

  // Observable for quiz results
  private quizResultsSubject = new BehaviorSubject<QuizResult[] | null>(null);
  quizResults$ = this.quizResultsSubject.asObservable(); // Allows components to subscribe
  mockQuizResults: QuizResult[] = [
    {
      question: 'What is the capital of France?',
      choices: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      answer: 'Paris',
      explanation: 'Paris is the capital and largest city of France.'
    },
    {
      question: 'Which programming language is used in Angular?',
      choices: ['Java', 'C#', 'TypeScript', 'Python'],
      answer: 'TypeScript',
      explanation: 'Angular is built using TypeScript, a superset of JavaScript.'
    }
  ];
  constructor() {}

  // Method to set quiz results
  setQuizResults(results: QuizResult[] | null): void {
    this.quizResultsSubject.next(results); // Update the observable
  }

  getMockQuizResults(): QuizResult[] {
    return this.mockQuizResults;
  }
  // Method to get quiz results (can be observed as well)
  getQuizResults(): QuizResult[] | null {
    return this.quizResultsSubject.getValue(); // Return the current value
  }

  // Method to set questions
  setQuestions(questions: any[]): void {
    this.questionsSubject.next(questions); // Update the observable
  }

  // Method to get questions (can be observed as well)
  getQuestions(): any[] {
    return this.questionsSubject.getValue(); // Return the current questions
  }
}
