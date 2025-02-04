import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {environment } from '../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  selectedType: string = 'Support';
  gitUrl: string = '';
  email: string = '';
  message: string = '';

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() closeRequested = new EventEmitter<void>(); // Emits event when close is clicked
 constructor(private http: HttpClient) {
 }
  submitForm() {
    const endpoint = `${environment.apiUrl}contactUs`;
    const formData = {
      type: this.selectedType,
      gitUrl: this.selectedType === 'Contribute' ? this.gitUrl : null,
      email: this.email,
      message: this.message
    };

    // Make the REST call to the backend
    this.http.post(endpoint, formData).subscribe(
      response => {
        // Handle success
        console.log('Form submitted successfully:', response);
      },
      error => {
        // Handle error
        console.error('Form submission failed:', error);
      }
    );
    this.closeForm();
  }
  closeForm() {
    this.closeRequested.emit(); // Notify parent to close form
  }
}
