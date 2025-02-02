import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SampleInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Intercepting Requests")
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');

    // If token exists, clone the request and add the Authorization header
    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Interceptor call end');
      return next.handle(clonedRequest);
    }

    return next.handle(request); // If no token, proceed without modifying request
  }
}
