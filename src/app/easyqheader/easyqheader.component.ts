import { Component, Input, OnInit } from '@angular/core';
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
  @Input() articleUrl: string | null = null;  // Accept articleUrl from parent component


  constructor(private dialog: MatDialog, private notificationService: NotificationService) {}

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

      // Automatically redirect to the mobile site after a brief message
      setTimeout(() => {
        const username = localStorage.getItem('username');
        const jwtToken = localStorage.getItem('jwtToken');
        const data = {
          userId: username,
          sessionToken: jwtToken,
          articleUrl: this.articleUrl,
          preferences: {
            theme: 'dark',
            notifications: true
          }
        };

// Convert data object to a JSON string
        const jsonData = JSON.stringify(data);

// Encode the JSON string to make it URL-safe
        const encodedData = encodeURIComponent(jsonData);

// Construct the URL with the encoded data as a query parameter
        const targetUrl = `https://mobile.easyqz.online?data=${encodedData}`;
        window.location.href = targetUrl;
      }, 5000);  // Redirect after 5 seconds

      // Hide the message after 5 seconds
      setTimeout(() => {
        this.flashMessageForMobile = null;
      }, 5000);
    }
  }
}
