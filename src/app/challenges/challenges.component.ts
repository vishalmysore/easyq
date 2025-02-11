
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgIf, NgStyle } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  imports: [

    MatCardContent,
    MatCardTitle,
    MatCardHeader,

    NgIf,
    MatCard,

    MatIcon,

    MatIconButton
  ],
  styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent  implements AfterViewInit {
  @ViewChild('panelElement') panelElement: ElementRef | undefined;

  isMinimized: boolean = false;
  userId: string = 'User1';
  currentArticle: string = 'AI in Practice';
  overallScore: number = 90;

  isResizing: boolean = false;
  startX: number = 0;
  startWidth: number = 0;

  // Ensure that the element is accessed only after the view has initialized
  ngAfterViewInit(): void {
    if (this.panelElement) {
      // Any code that requires panelElement to be initialized can go here
    }
  }

  // Start resizing action
  startResize(event: MouseEvent): void {
    if (this.panelElement) {
      this.isResizing = true;
      this.startX = event.clientX;
      this.startWidth = this.panelElement.nativeElement.offsetWidth;

      document.addEventListener('mousemove', this.onResize.bind(this));
      document.addEventListener('mouseup', this.stopResize.bind(this));
    }
  }

  // Handle resizing
  onResize(event: MouseEvent): void {
    if (this.isResizing && this.panelElement) {
      const width = this.startWidth + (event.clientX - this.startX);
      this.panelElement.nativeElement.style.width = `${width}px`;
    }
  }

  // Stop resizing
  stopResize(): void {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onResize.bind(this));
    document.removeEventListener('mouseup', this.stopResize.bind(this));
  }

  minimizePanel(): void {
    this.isMinimized = !this.isMinimized;
  }

  closePanel(): void {
    // Logic to close the panel
  }
}
