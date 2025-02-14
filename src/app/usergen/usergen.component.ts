import { Component, OnInit, OnDestroy } from '@angular/core';
import { generateUsername } from 'unique-username-generator';
import { UserService } from '../service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SignOnComponent } from '../sign-on/sign-on.component';
import { UserDetailsComponent } from '../user-details/user-details-component';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { AuthEventService } from '../interceptors/auth-event.service';
import { Subscription } from 'rxjs';
import { ScoreComponent } from '../score/score.component';
import { MatButton } from '@angular/material/button';
import { UsernameService } from '../service/username.service';
import { AuthGoogleService } from '../auth/auth.google.service';
import { NgIf } from '@angular/common';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usergen',
  templateUrl: './usergen.component.html',
  imports: [
    ScoreComponent,
    MatButton,
    NgIf
  ],
  styleUrl: './usergen.component.css'
})
export class UsergenComponent implements OnInit, OnDestroy {
  protected username: string | undefined;
  protected isVerified: boolean = false; // Initialize the verification status
  private authSubscription!: Subscription;
  private usernameSubscription!: Subscription;
  private verificationSubscription!: Subscription;

  constructor(
    private usernameService: UsernameService,
    private userService: UserService,
    private dialog: MatDialog,
    private authEventService: AuthEventService,
    private authGoogleService: AuthGoogleService,private http: HttpClient,
  ) {}

  ngOnInit() {
    this.setupUser();

    // Listen for token expiration event
    this.authSubscription = this.authEventService.authExpired$.subscribe(() => {
      console.log("Auth expired event received. Re-initializing user...");
      this.markUserForRemoval();
      this.setupUser();
    });
    this.usernameService.setupComplete$.subscribe((status) => {
      this.setupComplete = status;
      console.log("user setup done "+this.setupComplete);
    });
    // Listen to username changes
    this.usernameSubscription = this.usernameService.username$.subscribe((newUsername) => {
      if (newUsername) {
        this.username = newUsername; // Update the username when it changes
      }
    });

    // Listen to verification status
    this.verificationSubscription = this.usernameService.isVerified$.subscribe((isVerified) => {
      this.isVerified = isVerified; // Update the verification status
    });
  }

  private markUserForRemoval() {
    console.log('removing user...' + localStorage.getItem('username'));
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username');
    this.userService.markUserForRemoval();
  }
  setupComplete = false;

  private setupUser() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      let token = sessionStorage.getItem('jwtToken');
      if (!token) {
        token = localStorage.getItem('jwtToken');
      }
      if (!token || this.isTokenExpired(token)) {
        this.username = generateUsername("-", 4, 12);
        this.userService.createUser(this.username);
        localStorage.setItem('username', this.username);
      } else {
        console.log("user exists and token valid");
        this.usernameService.updateSetupComplete(true);
      }

    } else { // if username is not found as user has refreshed the cache
      this.username = generateUsername("-", 4, 12);
      console.log(this.username);
      this.userService.createUser(this.username);
      localStorage.setItem('username', this.username);
    }

    console.log(" JWT Token "+localStorage.getItem('jwtToken'));

  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp ? decodedToken.exp < Math.floor(Date.now() / 1000) : false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

  signUp(): void {
    this.dialog.open(SignOnComponent, { width: '60%', maxWidth: '600px', height: 'auto' });
  }

  openUserDetailsDialog(): void {
    this.dialog.open(UserDetailsComponent, {
      width: '80%',
      maxWidth: '600px',
      height: 'auto',
      data: { username: this.username }
    });
  }

  logout(): void {
    this.usernameService.updateVerificationStatus(false); // Update verification status on logout
    this.authGoogleService.logout(); // Log out from Google OAuth
    this.isVerified = false; // Set isVerified to false
    const backendUrlForGoogle = `${environment.apiUrl}logoutGoogle`;
    this.http.post(backendUrlForGoogle, {}).subscribe(
      (response) => {
        console.log('Logout API call successful:', response);
      },
      (error) => {
        console.error('Error logging out from the backend:', error);
      }
    );
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('username');
  }
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.verificationSubscription) {
      this.verificationSubscription.unsubscribe();
    }
  }
}
