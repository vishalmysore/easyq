import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../models/user.model';
import {environment} from '../../environments/environment';
import { UserPerformance, UserPerformanceService } from '../service/user.performance';
import { BehaviorSubject, switchMap } from 'rxjs';
import { UserPerformanceData } from '../models/user-performance-data.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './user-details-component.html',
  styleUrls: ['./user-details-component.css']
})
export class UserDetailsComponent  implements OnInit{
  user$ = new BehaviorSubject<User | null>(null);


  constructor(private userPerformanceService: UserPerformanceService) {}

  ngOnInit() {
    this.sendUserPerformance();
  }

  sendUserPerformance() {
    this.userPerformanceService.getUserPerformance().pipe(
      switchMap((userPerformance) => {
        console.log("Received UserPerformance:", userPerformance);
        return this.userPerformanceService.sendUserPerformance(userPerformance);
      })
    ).subscribe({
      next: (response: UserPerformanceData) => {
        console.log("Response received:", response);

        // Update user$ BehaviorSubject to notify UI about new data
        this.user$.next({
          name: response.emailId.split('@')[0] || "Unknown User", // Extracting name from email
          userId: response.userId,
          emailId: response.emailId,
          avatar: response.avatar || "https://i.pravatar.cc/150?img=3",
          expertTopics: response.topSkills || [],
          achievements: ["Improvement Areas: " + response.improvements.join(", ")],
          isPermanent: false
        });
      },
      error: (error) => console.error("Error occurred:", error)
    });
  }

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
    this.user$.next(null); // Hide the user profile
  }
}
