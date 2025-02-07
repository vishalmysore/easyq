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
import { Score } from './models/score.model';
import { Observable } from 'rxjs';
import { UserDetailsComponent } from './user-details/user-details-component';
import { MatDialog } from '@angular/material/dialog';
import { TrendingArticlesComponent } from './trending-articles/trending-articles.component';
import { AuthorInsightsComponent } from './author-insight/author-insight.component';
import { MatTooltip } from '@angular/material/tooltip';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { StoryPopupComponent } from './story-popup/story-popup.component';
import { StoryService } from './story.service';
import { Story } from './models/story.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Note: This should be `styleUrls`, not `styleUrl`
  standalone: true,
  imports: [MatProgressSpinner,RouterOutlet, FormsModule, NgForOf, NgIf, NgClass, UsergenComponent, EasyqheaderComponent, NgOptimizedImage, FooterComponent, MatButton, MatTooltip]// Add FormsModule here
})
export class AppComponent implements OnInit {
  story: Story | null = null;
  title = 'EasyQZ';
  inputValue: string = '';
  questions: any = null;
  isLoading: boolean = false;
  loadingMessages = [
    "Questions are being prepared...",
    "Please wait...",
    "We are almost there...",
    "Get ready!",
    "Let AI Do the Magic",
    "Its Human Vs AI",
    "Are you Ready?",
    "1",
    "2",
    "3"
  ];
  currentMessageIndex = 0;
  intervalId: any;
  articleUrl: string | null = null;
  quizSubmitted = false;
  scrolled = false;
  private httpClient: any;
  private prompt: string ='';
  constructor(private storyService: StoryService,private http: HttpClient,private route: ActivatedRoute, private router: Router, private quizService: QuizService,private linkService: LinkService,private dialog: MatDialog) {}

  startMessageRotation() {
    this.intervalId = setInterval(() => {
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length;
    }, 2000); // Change message every 2 seconds
  }

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
    this.quizService.resetQuestions$ // Listen for reset changes
      .subscribe((reset) => {
        if (reset) {
          this.questions = null; // Clear questions
          this.quizService.setResetQuestions(false); // Reset the flag
        }
      });
    this.storyService.story$.subscribe((story) => {
      this.story = story;
      console.log('Stored storyId:', this.story?.storyId);
    });

  }
  openTrendingArticlesDialog(): void {
    console.log('openTrendingArticlesDialog');
    this.dialog.open(TrendingArticlesComponent, {
      width: '80%', // Adjust the width for your preference
      maxWidth: '600px', // Set max width for popup
      height: 'auto', // Auto height or specify
      data: { username: 'hello' } // Pass data if needed
    });
  }
  openTrendingTopicsDialog(): void {
    console.log('openUserDetailsDialog');
    this.dialog.open(TrendingArticlesComponent, {
      width: '80%', // Adjust the width for your preference
      maxWidth: '600px', // Set max width for popup
      height: 'auto', // Auto height or specify
      data: { username: 'hello' } // Pass data if needed
    });
  }
  openAuthorInisightDialog(): void {
    console.log('openUserDetailsDialog');
    this.dialog.open(AuthorInsightsComponent, {
      width: '80%', // Adjust the width for your preference
      maxWidth: '600px', // Set max width for popup
      height: 'auto', // Auto height or specify
      data: { username: 'hello' } // Pass data if needed
    });
  }

  openStoryPopup() {
    this.isLoading = true;
    this.startMessageRotation();

    const storyTypes = [
      'horror', 'fantasy', 'mystery', 'sci-fi', 'adventure',
      'romance', 'thriller', 'historical fiction', 'comedy',
      'drama', 'dystopian', 'mythology', 'supernatural',
      'crime', 'detective', 'folklore','bollywood','indiana jones'
    ]; // More story types added

    const randomStoryType = storyTypes[Math.floor(Math.random() * storyTypes.length)]; // Pick a random type

    const user = JSON.parse(<string>localStorage.getItem('user'));
    const userId = user ? user.userId : null;

    // Fetch the story and open the popup only after fetching
    this.storyService.fetchStory(userId, randomStoryType);

    // Subscribe to the observable and open dialog when story is available
    this.storyService.story$.subscribe((story) => {
      if (story) {
        this.dialog.open(StoryPopupComponent, {
          maxWidth: '90vw', // Max width to 90% of viewport width
          maxHeight: '90vh', // Max height to 90% of viewport height
          width: 'auto', // Allow resizing
          height: 'auto',
          panelClass: 'custom-dialog-container' // Custom class to control styling
        });
        this.questions = story?.questions;
        this.quizSubmitted = false;
        this.scrolled = false;
        // Reset previous results
        this.quizService.setQuizResults(null);
        this.isLoading = false; // Stop loading indicator
      }
    });
  }


  navigateToEndpoint(difficulty: number) {
    this.isLoading = true;
    this.startMessageRotation()
    console.log(this.inputValue)
    const promptToSend = this.inputValue.trim() || this.prompt;
    const endpoint = `${environment.apiUrl}getQuestions?prompt=${promptToSend}&difficulty=${difficulty}`;
    this.quizSubmitted = false;
    this.questions = null;
    this.scrolled = false;

    // Reset previous results
    this.quizService.setQuizResults(null);

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
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      }
    );
  }
  selectedAnswers: { [key: string]: string } = {}; // Stores selected answers

  captureAnswer(questionId: string, selectedChoice: string) {
    this.selectedAnswers[questionId] = selectedChoice; // Store selected answer
  }


  createScoreObject(correctCount: number, skippedCount: number, totalQuestions: number): Score {
    const userId = 'user-id';  // Replace with actual userId (if available)
    const quizId = 'quiz-id';  // Replace with actual quizId (if available)
    const percentage = (correctCount / totalQuestions) * 100;
    const totalScore = correctCount * 10;  // Assuming each question is worth 10 points

    return new Score(
      userId,
      totalScore,
      totalQuestions,
      correctCount,
      totalQuestions - correctCount - skippedCount,
      skippedCount,
      totalScore,
      percentage,
      quizId,
      window.location.href,  // Current URL of the page
      'example-topics',  // Add topics here if needed
      this.questions
    );
  }

  // HTTP method to call the API (assuming you're using HttpClient for HTTP requests)


  transformToQuestionArray(quizResults: QuizResult[]): Question[] {
    return quizResults.map(result => ({
      questionId: parseInt(result.id, 10),  // Ensure the ID is a number
      questionText: result.question,
      answerChoices: result.choices,
      correctAnswer: result.answer,
      explanation: result.explanation || ''
    }));
  }

  submitResultsToAPI(correctCount: number, evaluatedResults: QuizResult[]) {
    // Create the Score object to send to the backend
    const score = new Score(
      'user123', // Replace with actual user ID
      correctCount,
      this.questions.length,
      correctCount,
      this.questions.length - correctCount,
      0, // Skipped questions can be calculated if needed
      correctCount * 10, // Calculate total score (modify as per logic)
      (correctCount / this.questions.length) * 100, // Percentage calculation
      'quiz123', // Replace with actual quiz ID
      'https://your-quiz-url.com', // Replace with actual URL
      'Topic1, Topic2', // Replace with actual topics
      this.transformToQuestionArray(evaluatedResults) // Map QuizResults to Question[] for submission
    );

    // Now, call the API to submit the results
    this.quizService.updateResults(score).subscribe(
      response => {
        console.log('Quiz results submitted successfully:', response);
      },
      error => {
        console.error('Error submitting quiz:', error);
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
    this.router.navigate(['/quiz-results']).then(() => {
      // After navigating, call the API to submit the quiz results
      this.submitResultsToAPI(correctCount, evaluatedResults);
    });
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
  selectedCategory: string | undefined;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 50) {
      this.scrolled = true; // Hide the scroll prompt when scrolling
    }
  }
  selectCategory(selectedCategory: string) {
    this.selectedCategory=selectedCategory;
  }
  getFunnyMessage(): string {
    switch (this.selectedCategory) {
      case 'kids':
        return "🎉 Ready for some fun? How about answering a Harry Potter quiz and showing off your wizard skills! 🧙‍♂️";
      case 'job_seeker':
        return "💼 Time to land that dream job! How about prepping with some Angular and Java interview questions? 💻";
      case 'learner':
        return "📚 Knowledge is power! Ever thought about diving into Agentic AI? Time to level up! 🤖";
      case 'fun':
        return "🎊 Let the good times roll! Fancy some Bollywood trivia to spice up your day? 🍿";
      default:
        return "";
    }
  }

  getInputPlaceHolder(): string {
    switch (this.selectedCategory) {
      case 'kids':
        this.prompt = "How to Train a Dragon Book";
        return this.prompt; // return this.prompt instead of 'prompt'
      case 'job_seeker':
        this.prompt = "Java and Agentic AI";
        return this.prompt;
      case 'learner':
        this.prompt = "Blockchain Basics";
        return this.prompt;
      case 'fun':
        this.prompt = "Bollywood";
        return this.prompt;
      default:
        this.prompt = "Topic or Link: Java Interview, World Economy, Cricket...";
        return this.prompt;
    }
  }
}
