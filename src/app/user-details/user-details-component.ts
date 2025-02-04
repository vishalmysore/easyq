import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './user-details-component.html',
  styleUrls: ['./user-details-component.css']
})
export class UserDetailsComponent {
  user: User |null = {
    name: "John Doe",
    userId: "John Doe",
    emailId: "johndoe@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    expertTopics: ["AI", "Cybersecurity", "Machine Learning"],
    achievements: ["Top Scorer", "AI Guru", "Fastest Learner"],
    isPermanent: false  // Set to true if user already has a permanent account
  };

  testResults = [
    { testName: "AI Basics", score: 85, date: "2024-01-10" },
    { testName: "Blockchain 101", score: 92, date: "2024-01-20" },
    { testName: "Cybersecurity Fundamentals", score: 88, date: "2024-02-02" }
  ];
  convertToPermanentAccount() {
    console.log("Redirecting to permanent account creation...");
    // Add logic to redirect the user or open a form/modal
  }

  closeProfile() {
    console.log("Profile Closed!");
    this.user = null; // Hide the user profile
  }
}
