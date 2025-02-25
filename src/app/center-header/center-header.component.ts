import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TrendingArticlesComponent } from '../trending-articles/trending-articles.component';
import { AuthorInsightsComponent } from '../author-insight/author-insight.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-center-header',
  imports: [
    MatButton
  ],
  templateUrl: './center-header.component.html',
  styleUrl: './center-header.component.css'
})
export class CenterHeaderComponent {

  constructor(private dialog: MatDialog) {
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
}
