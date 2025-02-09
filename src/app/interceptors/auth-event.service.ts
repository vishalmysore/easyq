import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthEventService {
  private authExpiredSubject = new Subject<void>();

  authExpired$ = this.authExpiredSubject.asObservable();

  notifyAuthExpired() {
    this.authExpiredSubject.next();
  }
}
