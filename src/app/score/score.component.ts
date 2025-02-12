import { Component, OnInit } from '@angular/core';
import {ScoreService} from '../service/score.service';
import { NgIf } from '@angular/common';
import { WebSocketService } from '../service/websocket.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  overallScore: number | null = null;
  errorMessage: string = '';

  webSocketSubscription: any;
  constructor(private scoreService: ScoreService, private webSocketService: WebSocketService) { }

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
}
