import { Component, OnDestroy, OnInit } from '@angular/core';
import {ScoreService} from '../service/score.service';
import { NgIf } from '@angular/common';
import { WebSocketService } from '../service/websocket.service';
import { UsernameService } from '../service/username.service';
import { NotificationService } from '../service/notification.service';
import { Subscription } from 'rxjs';
import {environment} from '../../environments/environment';
import {Notification} from '../models/notificaton.model';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit ,OnDestroy{
  overallScore: number | null = null;
  errorMessage: string = '';
  // WebSocket subscriptions
  private challengeSubscription: Subscription | undefined;
  private notificationSubscription: Subscription | undefined;
  webSocketSubscription: any;
  constructor(private scoreService: ScoreService, private webSocketService: WebSocketService,private userNameService : UsernameService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    // Fetch the overall score on component initialization
    this.getOverallScore();
    this.webSocketSubscription = this.webSocketService.connect('score') // Replace with the correct endpoint
      .subscribe(
        (message: any) => {
          // Handle the incoming WebSocket message (assuming it's a JSON with new score data)
          const data = JSON.parse(message); // Adjust parsing logic if necessary
          if (data.action === 'scoreUpdated') {
            // Update the score when a 'scoreUpdated' message is received
            this.overallScore = data.newScore;
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          this.errorMessage = 'Server Error. Please Refresh the page and try again.';
        }
      );
    this.challengeSubscription = this.webSocketService.connect('challenges').subscribe(
      (message: any) => {
        const data = JSON.parse(message);
        if (data.action === 'challengeReceived') {
          this.notificationService.incrementNotificationCount();
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

          const newNotification :Notification = {
            userId: data.userId,
            linkUrl: data.quizType === 'TOPIC'
              ? `${environment.easyQZUrl}?url=${data.topics}`
              : data.linkUrl,
            currentScore: data.currentScore,
            topics: data.topics,
            challengeHim: 'Challenge',  // Customize button text
          };
          this.notificationService.addNotification(newNotification);
        }
      },
      (error: any) => {
        console.error('SSE error:', error);
      }
    );
  }



  // Method to call the service and fetch the score
  getOverallScore(): void {
    this.scoreService.getOverallScore().subscribe(
      (score) => {
        this.overallScore = score;  // Store the fetched score
      },
      (error) => {
        console.error('RestAPI error:', error);
        this.errorMessage = 'Error fetching overall score: ';  // Handle error
      }
    );
  }

  ngOnDestroy(): void {
        if (this.challengeSubscription) {
        this.challengeSubscription.unsubscribe();
      }
      if (this.notificationSubscription) {
        this.notificationSubscription.unsubscribe();
      }
}


}
