import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {
  // Using BehaviorSubject to store the current username
  private usernameSubject = new BehaviorSubject<string | undefined>(undefined);

  // Observable stream for the username
  username$ = this.usernameSubject.asObservable();

  // Method to update the username
  updateUsername(newUsername: string) {
    this.usernameSubject.next(newUsername);
  }
}
