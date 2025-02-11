import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventSource!: EventSource;

  constructor(private http: HttpClient, private zone: NgZone) {}

  connect(): Observable<string> {
    return new Observable<string>(observer => {
      this.eventSource = new EventSource(`${environment.broadcastUrl}broadcast`); // Adjust your backend URL

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE error', error);
        this.eventSource.close();
        observer.complete();
      };

      return () => this.eventSource.close();
    });
  }
}
