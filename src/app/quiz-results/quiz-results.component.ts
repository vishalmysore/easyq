import { Component, OnInit } from '@angular/core';
import { QuizResult } from '../models/quiz-results-model';
import { QuizService } from '../service/quiz.service';
import {CommonModule, NgClass, NgForOf, NgIf} from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ResultsComponent} from '../results-component/results-component.component';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
  imports: [FormsModule, NgForOf, NgIf, NgClass,  ResultsComponent] // Add FormsModule here
})
export class QuizResultsComponent implements OnInit {
  totalScore: number = 0;
  correctAnswersPercentage: number = 0;
  tutorialLink: string = "https://www.example.com/tutorial"; // Link to further tutorial
  quizResults: QuizResult[] = []; // Holds quiz results from the service
  wrongAnswers: QuizResult[] = []; // Holds the wrong answers
  userAnswers: { [key: string]: string } = {}; // Stores user answers dynamically

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    // Get quiz results (correct answers) from the service
    this.quizService.quizResults$.subscribe((results) => {
      if (results) {
        this.quizResults = results;
        this.userAnswers = this.quizService.getUserAnswers(); // Get user answers
        this.calculateResults();
      } else {
        console.log('No quiz results available.');
        this.quizResults = [];
      }
    });
  }

  calculateResults() {
    let correctCount = 0;
    this.wrongAnswers = []; // Reset wrong answers list

    this.quizResults.forEach((question) => {
      const userAnswer = this.userAnswers[question.id]; // Get user answer by question ID
      const isCorrect = userAnswer === question.answer; // Compare with correct answer

      if (isCorrect) {
        correctCount++;
      } else {
        this.wrongAnswers.push(question); // Add to wrong answers list
      }
    });

    this.totalScore = correctCount; // Set total score
    this.correctAnswersPercentage = (this.quizResults.length > 0)
      ? (correctCount / this.quizResults.length) * 100
      : 0;
  }

}
