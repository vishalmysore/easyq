import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-author-insights',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './author-insight.component.html',
  styleUrls: ['./author-insight.component.css']
})
export class AuthorInsightsComponent implements OnInit {
  showPage: boolean = true;

  author = {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=4",
    bio: "Tech Blogger | AI Enthusiast | Passionate Writer",
  };

  articles = [
    { title: "The Future of AI", date: "2024-02-01", source: "Medium", quizTakers: 120, averageScore: 85, readiness: "Published" },
    { title: "Cybersecurity in 2024", date: "2024-01-20", source: "Dev.to", quizTakers: 98, averageScore: 78, readiness: "Published" },
    { title: "Blockchain Explained", date: "2024-01-10", source: "LinkedIn", quizTakers: 150, averageScore: 82, readiness: "Needs Improvement" }
  ];

  overallScore: number = 0;

  ngOnInit(): void {
    this.calculateOverallScore();
  }

  calculateOverallScore() {
    if (this.articles.length > 0) {
      const totalScore = this.articles.reduce((sum, article) => sum + article.averageScore, 0);
      this.overallScore = Math.round(totalScore / this.articles.length);
    }
  }

  editArticle(article: any) {
    console.log("Editing article:", article.title);
  }

  deleteArticle(article: any) {
    this.articles = this.articles.filter(a => a !== article);
    this.calculateOverallScore();
  }

  closeWindow() {
    console.log("Closing author insights window");
    this.showPage = false;
  }
}
