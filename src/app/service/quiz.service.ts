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
  quizResults$ = this.quizResultsSubject.asObservable();

  private currentCountSubject = new BehaviorSubject<number>(0);
  // Store user answers
  private userAnswers: { [key: string]: string } = {};

  // Get the count as an Observable
  currentCount$ = this.currentCountSubject.asObservable();



// Set the count
  setCurrentCount(count: number): void {
    this.currentCountSubject.next(count);
  }

// Get the current count value (directly, without subscription)
  getCurrentCount(): number {
    return this.currentCountSubject.value;
  }


  constructor() {}

  // Method to set quiz results
  setQuizResults(results: QuizResult[] | null): void {
    this.quizResultsSubject.next(results);
  }




  // Method to get quiz results
  getQuizResults(): QuizResult[] | null {
    return this.quizResultsSubject.getValue();
  }

  // Method to set questions
  setQuestions(questions: any[]): void {
    this.questionsSubject.next(questions);
  }

  // Method to get questions
  getQuestions(): any[] {
    return this.questionsSubject.getValue();
  }

  // ✅ Method to store user answers
  setUserAnswer(questionId: string, answer: string | null): void {
    if (answer != null) {
      this.userAnswers[questionId] = answer;
    }
  }

  // ✅ Method to retrieve all user answers
  getUserAnswers(): { [key: string]: string } {
    return this.userAnswers;
  }

  // ✅ Clear user answers (useful for resetting the quiz)
  clearUserAnswers(): void {
    this.userAnswers = {};
  }
}
