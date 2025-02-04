import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizResult } from '../models/quiz-results-model';
import { Score } from '../models/score.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuizService {

  private apiUrl = `${environment.apiUrl}updateResults`;
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

  constructor(private http: HttpClient) { }

// Set the count
  setCurrentCount(count: number): void {
    this.currentCountSubject.next(count);
  }

// Get the current count value (directly, without subscription)
  getCurrentCount(): number {
    return this.currentCountSubject.value;
  }




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

  updateResults(score: Score): Observable<any> {
    return this.http.post(this.apiUrl, score);
  }
}
