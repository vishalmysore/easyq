import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Notification} from '../models/notificaton.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventSource!: EventSource;
  private notificationCountSubject = new BehaviorSubject<number>(0);  // Set initial count to 0
  notificationCount$ = this.notificationCountSubject.asObservable();
  notificationsSubject = new BehaviorSubject<Notification[]>([]);  // To store the array of notifications
  notifications$ = this.notificationsSubject.asObservable();  // Observable for notifications
  constructor(private http: HttpClient, private zone: NgZone) {}

  connect(): Observable<string> {
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
    return new Observable<string>(observer => {
      this.eventSource = new EventSource(`${environment.broadcastUrl}broadcast?token=${token}`); // Adjust your backend URL

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
  updateNotificationCount(count: number) {
    this.notificationCountSubject.next(count);
  }

  // Increment notification count
  incrementNotificationCount() {
    const currentCount = this.notificationCountSubject.value;
    this.updateNotificationCount(currentCount + 1);
  }

  // Decrement notification count
  decrementNotificationCount() {
    const currentCount = this.notificationCountSubject.value;
    this.updateNotificationCount(currentCount - 1);
  }

  addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    this.incrementNotificationCount();  // Update the count whenever a new notification is added
  }
}
