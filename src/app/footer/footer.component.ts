import { Component } from '@angular/core';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { CommonModule, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    ContactUsComponent,
    NgIf,
    MatButton
  ],
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showContactForm = false;
  contactType = 'Support'; // Default type

  openContactForm(type: string) {
    this.contactType = type;
    this.showContactForm = true;
  }

  handleFormSubmission(data: any) {
    console.log('Form Submitted from Footer:', data);
    this.showContactForm = false; // Hide form after submission
  }
  closeContactForm() {
    this.showContactForm = false; // Close when user clicks the close button
  }
}
