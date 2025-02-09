import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  // Update the API URL as needed
  private apiUrl = `${environment.apiUrl}getOverAllScore`
  constructor(private http: HttpClient) { }

  // Method to fetch overall score
  getOverallScore(): Observable<number> {
    return this.http.get<number>(this.apiUrl);
  }
}
