import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Story } from './models/story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private apiUrl = `${environment.apiUrl}getStory`;

  // BehaviorSubject to hold story data
  private storySubject = new BehaviorSubject<Story | null>(null);
  story$ = this.storySubject.asObservable(); // Exposing as Observable

  constructor(private http: HttpClient) {}

  fetchStory(userId: string, storyType: string) {
    this.http.get<Story>(`${this.apiUrl}?userId=${userId}&storyType=${storyType}`).subscribe(
      (response: Story) => {
        const storyData: Story = {
          storyId: response.storyId,
          userId: userId,
          storyText: response.storyText,
          title: response.title,
          storyType: response.storyType,
          questions: response.questions
        };

        console.log('Story fetched:', storyData);
        this.storySubject.next(storyData); // Update BehaviorSubject
      },
      (error) => {
        console.error('Failed to fetch story', error);
      }
    );
  }
  clearStory() {
    this.storySubject.next(null);
  }
}
