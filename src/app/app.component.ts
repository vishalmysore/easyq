import { Component,OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { QuizService } from './service/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {QuizResult} from './models/quiz-results-model';
import {Environment} from '@angular/cli/lib/config/workspace-schema';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Note: This should be `styleUrls`, not `styleUrl`
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgForOf, NgIf], // Add FormsModule here
})
export class AppComponent implements OnInit {
  title = 'EasyQZ';
  inputValue: string = '';
  questions: any = null;
  isLoading: boolean = false;
  articleUrl: string | null = null;
  constructor(private http: HttpClient,private route: ActivatedRoute, private router: Router, private quizService: QuizService) {}

  ngOnInit() {
    console.log(environment.apiUrl);
    this.route.queryParams.subscribe(params => {
      this.articleUrl = params['url'] || document.referrer || null;

      if (!this.articleUrl) {
        console.log("No article URL found. Please try again.");
      } else {
        // Redirect to the actual quiz page with the detected URL
       this.inputValue = this.articleUrl;
       this.navigateToEndpoint();
      }
    });
  }
  navigateToEndpoint() {
    const endpoint = `${environment.apiUrl}getQuestions?prompt=${this.inputValue}`;

    // Reset previous results
    this.quizService.setQuizResults(null);
    this.isLoading = true;
    // Fetch the questions from the API
    this.http.get<any[]>(endpoint).subscribe(
      (data) => {
        this.questions = data.map(item => ({
          id: item.IDOfQuestion,
          text: item.TextofQuestion,
          choices: item.Options,
          answer: item.CorrectOption
        }));

        console.log('Fetched Questions:', this.questions); // Debugging
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching quiz questions:', error);
        this.isLoading = false;
      }
    );
  }
  selectedAnswers: { [key: string]: string } = {}; // Stores selected answers

  captureAnswer(questionId: string, selectedChoice: string) {
    this.selectedAnswers[questionId] = selectedChoice; // Store selected answer
  }

  submitQuiz() {
    console.log("Selected Answers:", this.selectedAnswers); // Debug log

    let correctCount = 0;
    let evaluatedResults: QuizResult[] = this.questions.map((question: any) => {
      const userAnswer = this.selectedAnswers[question.id] || null;
      const isCorrect = userAnswer === question.answer;
      this.quizService.setUserAnswer(question.id, userAnswer);

      if (isCorrect) {
        correctCount++;
      }

      return {
        id: question.id,
        question: question.text,
        choices: question.choices,
        answer: question.answer, // The correct answer
        userAnswer: userAnswer,
        isCorrect: isCorrect, // Added correctness flag
        explanation: question.explanation || ""
      };
    });

    // Set computed results instead of mock results
    this.quizService.setQuizResults(evaluatedResults);
    this.quizService.setCurrentCount(correctCount);

    // Navigate to the results page
    this.router.navigate(['/quiz-results']);
  }
}
