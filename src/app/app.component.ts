import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { QuizService } from './service/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {QuizResult} from './models/quiz-results-model';
import {Environment} from '@angular/cli/lib/config/workspace-schema';
import {environment} from '../environments/environment';
import {Question} from './models/question.model';
import { LinkService } from './service/link.service'
import { Link } from './models/link.model';
import { UsergenComponent } from './usergen/usergen.component';
import { EasyqheaderComponent } from './easyqheader/easyqheader.component';
import { FooterComponent } from './footer/footer.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Note: This should be `styleUrls`, not `styleUrl`
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgForOf, NgIf, NgClass, UsergenComponent, EasyqheaderComponent, NgOptimizedImage, FooterComponent, MatButton]// Add FormsModule here
})
export class AppComponent implements OnInit {
  title = 'EasyQZ';
  inputValue: string = '';
  questions: any = null;
  isLoading: boolean = false;
  articleUrl: string | null = null;
  trendingArticles: Link[] = [];
  quizSubmitted = false;
  scrolled = false;
  constructor(private http: HttpClient,private route: ActivatedRoute, private router: Router, private quizService: QuizService,private linkService: LinkService) {}

  ngOnInit() {
    console.log(environment.apiUrl);
    this.route.queryParams.subscribe(params => {
      this.articleUrl = params['url'] || document.referrer || null;

      if (!this.articleUrl) {
        console.log("No article URL found. Please try again.");
      } else {
        // Redirect to the actual quiz page with the detected URL
       this.inputValue = this.articleUrl;
       this.navigateToEndpoint(1);
      }
    });
  }
  navigateToEndpoint(difficulty: number) {
    const endpoint = `${environment.apiUrl}getQuestions?prompt=${this.inputValue}&difficulty=${difficulty}`;
    this.quizSubmitted = false;
    this.questions = null;
    this.scrolled = false;
    // Reset previous results
    this.quizService.setQuizResults(null);
    this.isLoading = true;
    // Fetch the questions from the API
    this.http.get<any[]>(endpoint).subscribe(
      (data) => {
        this.questions = data.map(item => ({
          questionId: item.questionId,           // Mapping 'id' to 'questionId'
          questionText: item.questionText,       // Mapping 'text' to 'questionText'
          answerChoices: item.answerChoices,   // Mapping 'choices' to 'answerChoices'
          correctAnswer: item.correctAnswer     // Mapping 'answer' to 'correctAnswer'
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

  fetchTrendingArticles() {
    this.linkService.getTrendingLinks().subscribe(
      (data) => {
        this.trendingArticles = data;
      },
      (error) => {
        console.error('Error fetching trending articles:', error);
      }
    );
  }

  submitQuiz() {
    console.log("Selected Answers:", this.selectedAnswers); // Debug log

    let correctCount = 0;
    let evaluatedResults: QuizResult[] = this.questions.map((question: any) => {
      const userAnswer = this.selectedAnswers[question.questionId] || null;
      const isCorrect = userAnswer === question.correctAnswer;
      this.quizService.setUserAnswer(question.questionId, userAnswer);

      if (isCorrect) {
        correctCount++;
      }

      return {
        id: question.questionId,
        question: question.questionText,
        choices: question.answerChoices,
        answer: question.correctAnswer, // The correct answer
        userAnswer: userAnswer,
        isCorrect: isCorrect, // Added correctness flag
        explanation: question.explanation || ""
      };
    });

    // Set computed results instead of mock results
    this.quizService.setQuizResults(evaluatedResults);
    this.quizService.setCurrentCount(correctCount);
    this.quizSubmitted = true;
    this.scrollToResults();
    // Navigate to the results page
    this.router.navigate(['/quiz-results']);
  }
  scrollToResults() {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 500); // Delay to allow the message to show before scrolling
  }

  // Listen for scroll events
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 50) {
      this.scrolled = true; // Hide the scroll prompt when scrolling
    }
  }
}
