import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-challenge-details-dialog',
  template: `
    <h2 mat-dialog-title>Challenge Details</h2>
    <mat-dialog-content>
      <p>User ID: {{ data.userId }}</p>
      <p>Reading: {{ data.readingArticle }}</p>
      <p>Current Score: {{ data.overallScore }}%</p>
      <mat-progress-bar mode="determinate" [value]="data.overallScore"></mat-progress-bar>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onClose()">Close</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogContent,
    MatProgressBar,
    MatDialogActions
  ]
})
export class ChallengeDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onClose(): void {
    // Close the dialog
  }
}
