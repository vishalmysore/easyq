import { Component, OnInit } from '@angular/core';
import { UserAnswer } from '../models/user-answer.model';
import { QuizResult } from '../models/quiz-results-model';
import { QuizService } from '../service/quiz.service';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
  imports: [ FormsModule, NgForOf, NgIf], // Add FormsModule here
})
export class QuizResultsComponent implements OnInit {
  totalScore: number = 0;
  wrongAnswers: any[] = [];
  correctAnswersPercentage: number = 0;
  tutorialLink: string = "https://www.example.com/tutorial"; // Link to further tutorial
  quizResults: QuizResult[] = []; // This will hold quiz results from the service

  userAnswers: UserAnswer[] = [
    { questionId: 1, answer: "Paris" },
    { questionId: 2, answer: "TypeScript" }
  ]; // Example answers, adjust based on real data

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    // Subscribe to quizResults$ to reactively get quiz results
    this.quizService.quizResults$.subscribe((results) => {
      if (results) {
        this.quizResults = results; // Set quiz results
        this.calculateResults();
      } else {
        // Handle the case where no quiz results are available
        console.log('No quiz results available.');
        this.quizResults = [];
      }
    });
  }

  calculateResults() {
    let correctCount = 0;
    this.wrongAnswers = [];
    console.log(this.quizResults);
    // Check answers against quiz results
    this.quizResults.forEach((question, index) => {
      const userAnswer = this.userAnswers.find(a => a.questionId === index + 1)?.answer;
      if (userAnswer === question.answer) {
        correctCount++;
      } else {
        this.wrongAnswers.push(question);
      }
    });

    this.totalScore = correctCount;
    this.correctAnswersPercentage = (correctCount / this.quizResults.length) * 100;
  }
}
