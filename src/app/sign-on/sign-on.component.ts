import {Component, effect, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import { AuthGoogleService } from '../auth/auth.google.service';
import { MatTooltip } from '@angular/material/tooltip';
@Component({
  selector: 'app-sign-on',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatTooltip
  ],
  templateUrl: './sign-on.component.html',
  styleUrl: './sign-on.component.css'
})
export class SignOnComponent {
  private authService = inject(AuthGoogleService);
  signInWithGoogle() {
    this.authService.login();

  }

}
