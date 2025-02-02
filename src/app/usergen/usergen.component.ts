import { Component } from '@angular/core';
import { generateUsername } from 'unique-username-generator';
import {UserService} from '../service/user.service';
import { MatButton } from '@angular/material/button';
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
  constructor(private userService: UserService) {}
  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.userService.createUser(this.username)// stop gap till we get sso working
    } else {
      // Generate a random username using the username-generator package
      this.username = generateUsername('-');  // Assign to the component's property
      console.log(this.username);
      this.userService.createUser(this.username)
      // Store the generated username in localStorage
      localStorage.setItem('username', this.username);
    }
  }
}
