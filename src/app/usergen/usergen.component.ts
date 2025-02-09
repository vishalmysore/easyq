import { Component, OnInit, OnDestroy } from '@angular/core';
import { generateUsername } from 'unique-username-generator';
import { UserService } from '../service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SignOnComponent } from '../sign-on/sign-on.component';
import { UserDetailsComponent } from '../user-details/user-details-component';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { AuthEventService } from '../interceptors/auth-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usergen',
  templateUrl: './usergen.component.html',
  styleUrl: './usergen.component.css'
})
export class UsergenComponent implements OnInit, OnDestroy {
  protected username: string | undefined;
  private authSubscription!: Subscription;

  constructor(private userService: UserService, private dialog: MatDialog, private authEventService: AuthEventService) {}

  ngOnInit() {
    this.setupUser();

    // Listen for token expiration event
    this.authSubscription = this.authEventService.authExpired$.subscribe(() => {
      console.log("Auth expired event received. Re-initializing user...");
      this.markUserForRemoval();
      this.setupUser();
    });
  }

  private markUserForRemoval() {
    console.log('removing user...'+ localStorage.getItem('username'));
    //localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
   // sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username');
    this.userService.markUserForRemoval();

  }

  private setupUser() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      const token = sessionStorage.getItem('jwtToken');
      if (!token || this.isTokenExpired(token)) {
        this.username = generateUsername("-", 4, 12);;
        this.userService.createUser(this.username);
        localStorage.setItem('username', this.username);
      }
    } else {
      this.username = generateUsername("-", 4, 12);
      console.log(this.username);
      this.userService.createUser(this.username);
      localStorage.setItem('username', this.username);
    }
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

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
