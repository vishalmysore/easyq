import { Component, OnInit } from '@angular/core';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { BookmarkletComponent } from '../bookmark/bookmark.component';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ChallengesComponent } from '../challenges/challenges.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-easyqheader',
  imports: [
    MatAnchor,
    NgIf,
    MatIconButton,
    MatIcon


  ],
  templateUrl: './easyqheader.component.html',
  styleUrl: './easyqheader.component.css'
})
export class EasyqheaderComponent implements OnInit {
  isMobile: boolean = false;
  flashMessageForMobile: string | null = null;
  notificationCount: number = 0;
  constructor(private dialog: MatDialog,private notificationService: NotificationService) {}
  ngOnInit() {
    this.detectMobile();
    this.notificationService.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
    });
  }
  openNotificationDialog() {
    this.dialog.open(ChallengesComponent, {
      width: '80%',
      maxWidth: '600px', // Set max width for dialog
      height: '70%',    // Set height for dialog
      panelClass: 'notification-dialog' // Optional: Custom class for styling
    });
  }
  detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    this.isMobile = /android|iphone|ipad|ipod|opera mini|blackberry|windows phone/i.test(userAgent);

    if (this.isMobile) {
      this.flashMessageForMobile = 'Currently, we support only the web version.!';

      // Hide the message after 5 seconds
      setTimeout(() => {
        this.flashMessageForMobile = null;
      }, 5000);
    }
  }

}
