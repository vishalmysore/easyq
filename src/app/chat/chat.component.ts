import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  messageInput: string = '';
  private messageSubscription: Subscription;

  constructor(private webSocketService: WebSocketService) {
    this.messageSubscription = this.webSocketService.connect('/ws/chat').subscribe(
      (message: string) => {
        this.messages.push(message);
      },
      (error) => {
        console.error('WebSocket error:', error);
      }
    );
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
    if (token) {
      this.webSocketService.connect('/ws/chat' ); // Replace with your WebSocket server URL
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.webSocketService.closeConnection('/ws/chat') ;
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.webSocketService.sendMessage('/ws/chat' ,this.messageInput);
      this.messages.push(`You: ${this.messageInput}`);  // Show the message in the chat panel
      this.messageInput = '';  // Clear the input field
    }
  }
}
