import { Component } from '@angular/core';
import { generateUsername } from 'unique-username-generator';

@Component({
  selector: 'app-usergen',
  imports: [],
  templateUrl: './usergen.component.html',
  styleUrl: './usergen.component.css'
})
export class UsergenComponent {
  protected username: string | undefined;

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      // Generate a random username using the username-generator package
      this.username = generateUsername('-');  // Assign to the component's property
      console.log(this.username);
      // Store the generated username in localStorage
      localStorage.setItem('username', this.username);
    }
  }
}
