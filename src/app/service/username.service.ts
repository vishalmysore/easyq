import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsernameService {
  // Using BehaviorSubject to track the verification status
  private isVerifiedSubject = new BehaviorSubject<boolean>(false); // Default to false (not verified)
  isVerified$ = this.isVerifiedSubject.asObservable(); // Observable to be used in components

  private usernameSubject = new BehaviorSubject<string | undefined>(undefined);
  username$ = this.usernameSubject.asObservable();

  private setupCompleteSubject = new BehaviorSubject<boolean>(false); // Tracks setup completion
  setupComplete$ = this.setupCompleteSubject.asObservable();

  constructor() {}

  // Update the verification status
  updateVerificationStatus(status: boolean) {
    this.isVerifiedSubject.next(status);
  }

  // Update the username
  updateUsername(newUsername: string) {
    this.usernameSubject.next(newUsername);
  }

  // Update setup completion status
  updateSetupComplete(status: boolean) {
    this.setupCompleteSubject.next(status);
  }
}
