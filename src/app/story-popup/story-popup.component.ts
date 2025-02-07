import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Story } from '../models/story.model';
import { StoryService } from '../story.service';
import { MatButton } from '@angular/material/button';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-story-popup',
  templateUrl: './story-popup.component.html',
  imports: [
    MatButton,
    CdkDrag
  ],
  styleUrls: ['./story-popup.component.css']
})
export class StoryPopupComponent implements OnInit {
  timeLeft: number = 5 * 60;
  interval: any;
  story?: Story;

  constructor(
    public dialogRef: MatDialogRef<StoryPopupComponent>,
    private storyService: StoryService
  ) {}

  ngOnInit(): void {
    // Subscribe to story updates
    this.storyService.story$.subscribe((storyData) => {
      if (storyData) {
        this.story = storyData;
        console.log('Story data updated in popup:', this.story);
      }
    });

    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.closePopup();
      }
    }, 1000);
  }

  closePopup() {
    this.storyService.clearStory();
    clearInterval(this.interval);
    this.dialogRef.close();
  }
}
