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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignOnComponent } from '../sign-on/sign-on.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule, MatProgressSpinner, MatFormField, MatInput, FormsModule],
  templateUrl: './user-details-component.html',
  styleUrls: ['./user-details-component.css']
})
export class UserDetailsComponent  implements OnInit{
  user$ = new BehaviorSubject<User | null>(null);
  loading$ = new BehaviorSubject<boolean>(true);
  searchQuery: string = '';
  searchResults: string[] = [];

  constructor(private userPerformanceService: UserPerformanceService,private dialogRef: MatDialogRef<UserDetailsComponent>,private dialog: MatDialog,) {}
  loadingMessages: string[] = [
    "Loading user details...",
    "Calculating score...",
    "Analyzing result...",
    "Suggesting improvement areas..."
  ];
  ngOnInit() {
    this.sendUserPerformance();
  }

  ragSearch() {
    if (!this.searchQuery.trim()) {
      console.warn('Search query is empty');
      return;
    }

    this.userPerformanceService.ragSearchOnUserPerformance(this.searchQuery).subscribe(
      (results) => {
        this.searchResults = results; // Assuming results are an array of strings
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }
  sendUserPerformance() {

    this.userPerformanceService.getUserPerformance().pipe(
      switchMap((userPerformance) => {
        console.log("Received UserPerformance:", userPerformance);
        return this.userPerformanceService.sendUserPerformance(userPerformance);
      })
    ).subscribe({
      next: (response: UserPerformanceData) => {
        this.loading$.next(false);
        console.log("Response received:", response);

        // Ensure emailId is not null/undefined and extract the name
        const name = response.emailId ? response.emailId.split('@')[0] : "Unknown User";
        this.testResults  = response.articles?.map(article => ({
          testName: article.testName,
          score: article.score,
          date: article.dateTaken
        })) || [];  //

        // Update user$ BehaviorSubject to notify UI about new data
        this.user$.next({
          name: name,
          userId: response.userId,
          emailId: response.emailId,
          avatar: response.avatar || "https://i.pravatar.cc/150?img=3", // Default avatar if none
          expertTopics: response.topSkills || [], // Fallback to an empty array if topSkills is null/undefined
          achievements: ["Improvement Areas: " + (response.improvements?.join(", ") || "No improvements")],
          isPermanent: response.verified,
          articles: response.articles
        });
      },
      error: (error) => {
        console.error("Error occurred:", error);
        this.loading$.next(false);
        // Handle errors as needed (e.g., show a user-friendly message)
      }
    });

    this.showLoadingMessages();
  }
  currentMessage: string = "Loading user details...";
  showLoadingMessages() {
    let messageIndex = 0; // Start from the first message

    // Update message every 2 seconds
    const intervalId = setInterval(() => {
      if (messageIndex < this.loadingMessages.length) {
        this.currentMessage = this.loadingMessages[messageIndex];
        messageIndex++;
      } else {
        clearInterval(intervalId); // Stop once all messages have been shown
      }
    }, 2000);
  }
  testResults = [
    { testName: "AI Basics", score: 85, date: "2024-01-10" },
    { testName: "Blockchain 101", score: 92, date: "2024-01-20" },
    { testName: "Cybersecurity Fundamentals", score: 88, date: "2024-02-02" }
  ];
  convertToPermanentAccount() {
    console.log("Redirecting to permanent account creation...");
    // Add logic to redirect the user or open a form/modal
    const dialogRef = this.dialog.open(SignOnComponent, {
      width: '80%',
      maxWidth: '600px',
      height: 'auto',

    });

    dialogRef.afterClosed().subscribe(() => {
      console.log("user Dialog closed");
      // Optionally handle additional actions after dialog is closed
    });
  }

  closeProfile() {
    console.log("Profile Closed!");
    this.user$.next(null); // Hide the user profile
    this.dialogRef.close();
  }
}
