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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Note: This should be `styleUrls`, not `styleUrl`
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgForOf, NgIf], // Add FormsModule here
})
export class AppComponent implements OnInit {
  title = 'EasyQ';
  inputValue: string = '';
  questions: any = null;
  mockQuestions: any = null;
  articleUrl: string | null = null;
  constructor(private http: HttpClient,private route: ActivatedRoute, private router: Router, private quizService: QuizService) {}

  ngOnInit() {
    this.mockQuestions = [
      {
        id: 1,
        text: 'What is the capital of France?',
        choices: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        answer: 'Paris'
      },
      {
        id: 2,
        text: 'Which programming language is used in Angular?',
        choices: ['Java', 'C#', 'TypeScript', 'Python'],
        answer: 'TypeScript'
      }
    ];
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
    const endpoint = `https://vishalmysore-easyqserver.hf.space/getQuestions?prompt=${this.inputValue}`;

    // Reset previous results
    this.quizService.setQuizResults(null);

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
      },
      (error) => {
        console.error('Error fetching quiz questions:', error);
      }
    );
  }
  submitQuiz() {
    // Optionally, you can validate the answers or do something with the selected answers

    console.log(this.questions);
    this.quizService.setQuestions(this.questions);
    this.quizService.setQuizResults(this.quizService.getMockQuizResults()); // Set quiz results
    // Navigate to another component (e.g., quiz-results component)
    this.router.navigate(['/quiz-results']);
  }
}
