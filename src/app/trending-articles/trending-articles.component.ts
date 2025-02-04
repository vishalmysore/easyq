import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LinkService } from '../service/link.service';
import { Link } from '../models/link.model';

@Component({
  selector: 'app-trending-articles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './trending-articles.component.html',
  styleUrls: ['./trending-articles.component.css']
})
export class TrendingArticlesComponent implements OnInit {
  trendingLinks: Link[] = [];
  isVisible = true; // Controls visibility
  trendingArticles: Link[] = [];
  constructor(private linkService: LinkService) {}

  ngOnInit() {
    this.fetchTrendingArticles()
    this.linkService.getTrendingLinks().subscribe((links: Link[]) => {
      this.trendingLinks = links;
    });
  }

  closeTrendingArticles() {
    console.log("Trending Articles Closed!");
    this.isVisible = false; // Hide the trending articles section
  }

  fetchTrendingArticles() {
    this.linkService.getTrendingLinks().subscribe(
      (data: Link[]) => {
        this.trendingArticles = data;
      },
      (error:any) => {
        console.error('Error fetching trending articles:', error);
      }
    );
  }
}
