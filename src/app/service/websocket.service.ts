import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private sockets: { [key: string]: WebSocket } = {};  // Store WebSocket connections by endpoint
  private messageSubjects: { [key: string]: Subject<any> } = {}; // Store message observables for each connection

  constructor() { }

  // Connect to a WebSocket endpoint
  connect(endpoint: string): Observable<any> {
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');

    if (this.sockets[endpoint]) {
      console.log(`Already connected to ${endpoint}`);
      return this.messageSubjects[endpoint].asObservable();
    }

    const url = `${environment.wsUrl}${endpoint}?token=${token}`;
    const socket = new WebSocket(url);
    this.sockets[endpoint] = socket;
    this.messageSubjects[endpoint] = new Subject<any>();

    socket.onopen = () => {
      console.log(`WebSocket connection opened for ${endpoint}`);
    };

    socket.onmessage = (event) => {
      console.log(`Message received from ${endpoint}:`, event.data);
      this.messageSubjects[endpoint].next(event.data); // Emit the received message
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${endpoint}:`, error);
      this.messageSubjects[endpoint].error(error);
    };

    socket.onclose = () => {
      console.log(`WebSocket connection closed for ${endpoint}`);
      this.messageSubjects[endpoint].complete(); // Complete the subject when WebSocket closes
      delete this.sockets[endpoint];
      delete this.messageSubjects[endpoint];
    };

    return this.messageSubjects[endpoint].asObservable();
  }

  // Send message to the WebSocket
  sendMessage(endpoint: string, message: string): void {
    const socket = this.sockets[endpoint];
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      console.log(`Message sent to ${endpoint}:`, message);
    } else {
      console.error(`WebSocket not connected to ${endpoint}`);
    }
  }

  // Close WebSocket connection
  closeConnection(endpoint: string): void {
    if (this.sockets[endpoint]) {
      this.sockets[endpoint].close();
      delete this.sockets[endpoint];
      delete this.messageSubjects[endpoint];
      console.log(`WebSocket connection closed for ${endpoint}`);
    }
  }
}
