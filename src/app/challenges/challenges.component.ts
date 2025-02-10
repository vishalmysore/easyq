import { Component, OnInit, OnDestroy } from '@angular/core';
 // Your WebSocket service for handling connections
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {WebSocketService} from '../service/websocket.service';
import { ChallengeDetailsDialog } from './challege.detail';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgIf, NgStyle } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  imports: [

    MatCardContent,
    MatCardTitle,
    MatCardHeader,

    NgIf,
    MatCard,
    CdkDrag,
    MatIcon,
    NgStyle,
    MatIconButton,  CdkDragHandle
  ],
  styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent implements OnInit, OnDestroy {
  public userId: string = 'User123';  // Example userId
  public readingArticle: string = 'Angular Guide';  // Example article
  public overallScore: number | null = null;
  private webSocketSubscription: any;
  currentArticle = 'Angular for Beginners';
  position = { x: 50, y: 50 }; // Default position
  isMinimized = false; // Track if the panel is minimized
  constructor(
    private webSocketService: WebSocketService,  // Your WebSocket service
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {


  }

  ngOnInit(): void {
    // Establish WebSocket subscription
    this.webSocketSubscription = this.webSocketService.connect('notifications')  // Update the endpoint as required
      .subscribe(
        (message: any) => {
          try {
            const data = JSON.parse(message);  // Assuming server sends JSON message
            if (data.action === 'scoreUpdated') {
              this.overallScore = data.newScore;
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
        }
      );
  }

  // Minimize the panel
  minimizePanel() {
    this.isMinimized = !this.isMinimized;
  }

  // Close the panel
  closePanel() {
    // You can trigger an event here to close/remove the panel if needed
    // For now, we'll just hide the panel content.
    // You can also remove it from the DOM using *ngIf or set a boolean flag.
    console.log('Closing the panel');
    // Add custom logic to handle panel close here
  }
  ngOnDestroy(): void {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
  }

  openChallengeDialog(): void {
    this.dialog.open(ChallengeDetailsDialog, {
      data: {
        userId: this.userId,
        readingArticle: this.readingArticle,
        overallScore: this.overallScore
      }
    });
  }



}
