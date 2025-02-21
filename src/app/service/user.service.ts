import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {environment} from '../../environments/environment';
import { generateUsername } from 'unique-username-generator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, delay } from 'rxjs';
import { UsernameService } from './username.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private maxRetries = 2;
  constructor(private http: HttpClient,private snackBar: MatSnackBar,private usernameService: UsernameService,) { }

  createUser(username: string, attempt: number = 1): void {
    if (attempt > this.maxRetries) {
      this.showFlashMessage();
      return;
    }

    const user: User = {
      userId: username,
      emailId: null,
      name: username,
      avatar: `https://i.pravatar.cc/150?img=${username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70 + 1}`,
      expertTopics: ["AI", "Cybersecurity", "Machine Learning"],
      achievements: ["Top Scorer", "AI Guru", "Fastest Learner"],
      isPermanent: false,
      articles :[]
    };

    const endpoint = `${environment.apiUrl}createNewTempUser`;

    this.http.post<any>(endpoint, user).subscribe(
      (response) => {

        // Store token
        const token = response.token;
        sessionStorage.setItem('jwtToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('jwtToken', token);
        this.usernameService.updateSetupComplete(true);
        console.log("User created successfully:", user);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.usernameService.updateSetupComplete(false);
          console.warn(`User creation failed. Retrying with a new username (Attempt ${attempt})...`);
          const newUsername = generateUsername("-", 4, 12);;

          // Retry after 500ms
          of(null).pipe(delay(500)).subscribe(() => {
            this.createUser(newUsername, attempt + 1);
          });
        } else {
          console.error("Error creating user:", error);
        }
      }
    );
  }

  private showFlashMessage(): void {
    this.snackBar.open(
      'User creation failed. Please clear cache and restart.',
      'OK',
      { duration: 5000, panelClass: 'error-snackbar' }
    );
  }

  markUserForRemoval() {
    const endpoint = `${environment.apiUrl}markUserForRemoval`;

    return this.http.get<any>(endpoint).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
      },
      (error) => {
        console.error('Error marking user for removal:', error);
      }
    );
  }

}
