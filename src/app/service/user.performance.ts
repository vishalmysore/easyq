import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface UserPerformance {
  overallScore: number;
  quizType: string;
  articles: any[]; // Adjust this based on ArticleDetails structure
  topLink: string;
  overallWrongAnswers: number;
  strongAreas: { [key: string]: string };
  weakAreas: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class UserPerformanceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendUserPerformance(userPerformance: UserPerformance): Observable<any> {
    return this.http.post(`${this.apiUrl}askLLMForUserAnalytics`, userPerformance);
  }

  ragSearchOnUserPerformance( query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}ragSearch`, query);
  }

  getUserPerformance(): Observable<any> {
    return this.http.get(`${this.apiUrl}getUserAnalytics`);
  }
}
