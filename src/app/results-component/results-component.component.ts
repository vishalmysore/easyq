import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';

@Component({
  selector: 'app-results-component',
  imports: [
    RouterLink,
    MatAnchor,
    MatButton
  ],
  templateUrl: './results-component.component.html',
  styleUrl: './results-component.component.css'
})
export class ResultsComponent {
  shareResults() {
    const shareText = "I just completed my quiz on EasyQz! Check out my results.";
    const shareUrl = window.location.href;
    const fullShareText = `${shareText} ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Quiz Results',
        text: fullShareText,
        url: shareUrl
      }).catch(err => console.error('Error sharing:', err));
    } else {
      alert("Sharing not supported on this browser. Copy this link instead: " + shareUrl);
    }
  }

  printCertificate() {
    window.print(); // Opens the browser print dialog
  }

}
