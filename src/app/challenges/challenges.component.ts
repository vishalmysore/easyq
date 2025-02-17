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
import {environment} from '../../environments/environment';

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


  constructor(private webSocketService: WebSocketService,private notificationService: NotificationService) {}
  notificationSubscription: Subscription | undefined;
  ngOnInit(): void {
    // Subscribe to notifications from NotificationService
    this.notificationSubscription = this.notificationService.notificationsSubject.subscribe(
      (notifications) => {
        console.log("Notifications received:", notifications);
        this.notificationData = notifications; // Update notification data with the latest notifications
        this.notificationDataSource = new MatTableDataSource(this.notificationData); // Refresh the table data
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from notifications to avoid memory leaks
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  // Method to handle user challenge action (e.g., opening challenge interface)
  challenge(user: any): void {
    console.log(`Challenging user: ${user.userId}`);
    // Implement logic to challenge the user (e.g., navigation or UI update)
  }
}
