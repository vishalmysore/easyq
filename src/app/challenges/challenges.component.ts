import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {WebSocketService} from '../service/websocket.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
  imports: [
    MatTable,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCell,
    MatHeaderCell,
    MatCellDef,
    MatHeaderCellDef,
    MatButton,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow
  ]
})
export class ChallengesComponent implements OnInit, OnDestroy {
  @ViewChild('panelElement') panelElement: ElementRef | undefined;

  // User Data: A list of users who can be challenged
  userData = [
    { userId: 'simpley-plyer', linkUrl: 'https://medium.com/p/94a6dc7700dd', topics:'AI, Java, Agentic',currentScore: 80, challengeHim: 'Challenge' },
    { userId: 'snow-storm', linkUrl: 'https://medium.com/p/2c74b60f3598',topics:'LLM, Embeddings', currentScore: 90, challengeHim: 'Challenge' }
  ];

  // Notification Data: List of notifications for test takers
  notificationData = [
    { userId: 'expert-master', linkUrl: 'https://medium.com/p/dd8a608b5742', topics:'artificial intelligence',currentScore: 85, challengeHim: 'Challenge' }
  ];

  // Columns to be displayed in the table (common for both userData and notificationData)
  displayedColumns: string[] = ['userId', 'linkUrl','topics' ,'currentScore', 'challengeHim'];

  // Data sources for tables
  userDataSource = new MatTableDataSource(this.userData);
  notificationDataSource = new MatTableDataSource(this.notificationData);

  // WebSocket subscriptions
  private challengeSubscription: Subscription | undefined;
  private notificationSubscription: Subscription | undefined;

  constructor(private webSocketService: WebSocketService,private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to WebSocket channels for both challenges and notifications

    // Challenge WebSocket (for receiving score updates or challenges)
    this.challengeSubscription = this.webSocketService.connect('challenges').subscribe(
      (message: any) => {
        const data = JSON.parse(message);
        if (data.action === 'scoreUpdated') {
          this.updateUserScore(data.userId, data.newScore);  // Update score if necessary
        }
      },
      (error: any) => {
        console.error('WebSocket error:', error);
      }
    );

    // Notification WebSocket (for receiving new notifications)
    this.notificationSubscription = this.notificationService.connect().subscribe(
      (message: string) => {
        const data = JSON.parse(message);
        console.log("notification received "+data);
        if (data.action === 'newTestTaken') {
          this.addNotification(data);  // Add a new notification when a test is taken
        }
      },
      (error: any) => {
        console.error('SSE error:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from WebSocket connections to avoid memory leaks
    if (this.challengeSubscription) {
      this.challengeSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  // Method to update the score when a WebSocket sends updated score
  updateUserScore(userId: string, newScore: number): void {
    const user = this.userData.find(u => u.userId === userId);
    if (user) {
      user.currentScore = newScore;
      this.userDataSource = new MatTableDataSource(this.userData);  // Refresh the user table data
    }
  }

  // Add a new notification when a test is taken
  addNotification(notificationData: any): void {
    const newNotification = {
      userId: notificationData.userId,
      linkUrl: notificationData.linkUrl,
      currentScore: notificationData.currentScore,
      topics: notificationData.topics,
      challengeHim: 'Challenge',  // Button text can be customized
    };
    console.log(newNotification);
    this.notificationData.push(newNotification);
    this.notificationDataSource = new MatTableDataSource(this.notificationData);  // Refresh the notification table data
  }

  // Method to handle user challenge action (e.g., opening challenge interface)
  challenge(user: any): void {
    console.log(`Challenging user: ${user.userId}`);
    // Implement logic to challenge the user (e.g., navigation or UI update)
  }
}
