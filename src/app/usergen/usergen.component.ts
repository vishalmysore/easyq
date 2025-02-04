import { Component } from '@angular/core';
import { generateUsername } from 'unique-username-generator';
import {UserService} from '../service/user.service';
import { MatButton } from '@angular/material/button';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { UserDetailsComponent } from '../user-details/user-details-component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-usergen',
  imports: [
    MatButton
  ],
  templateUrl: './usergen.component.html',
  styleUrl: './usergen.component.css'
})
export class UsergenComponent {
  protected username: string | undefined;
  constructor(private userService: UserService,private dialog: MatDialog) {}
  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      const token = sessionStorage.getItem('jwtToken');
      if (!token || this.isTokenExpired(token)){
        this.userService.createUser(this.username)// stop gap till we get sso working
      }
    } else {
      // Generate a random username using the username-generator package
      this.username = generateUsername('-');  // Assign to the component's property
      console.log(this.username);
      this.userService.createUser(this.username)
      // Store the generated username in localStorage
      localStorage.setItem('username', this.username);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken.exp) {
        return false;
      }
      return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

  signUp() : void {
    console.log("Impo");
  }
  openUserDetailsDialog(): void {
    console.log('openUserDetailsDialog');
    this.dialog.open(UserDetailsComponent, {
      width: '80%', // Adjust the width for your preference
      maxWidth: '600px', // Set max width for popup
      height: 'auto', // Auto height or specify
      data: { username: this.username } // Pass data if needed
    });
  }
}
