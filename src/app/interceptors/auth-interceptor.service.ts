import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { generateUsername } from 'unique-username-generator';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  protected username: string | undefined;
  constructor(private userService: UserService,private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Intercepting Requests")
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
    if (request.url.includes('/createNewUser')) {
      console.log("Skipping sending JWT back for new user");
      return next.handle(request);
    }
    //let authReq = request;

    if (!token || this.isTokenExpired(token)) {
      sessionStorage.removeItem('jwtToken');
      localStorage.removeItem('jwtToken');

      // Redirect to the main page (adjust the route as needed)
      this.router.navigate(['/']);
    }
    // If token exists, clone the request and add the Authorization header

      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) { // Token expired or unauthorized
            console.warn('JWT expired. Redirecting to login...');
            // this.authService.logout(); // Clear session
            sessionStorage.removeItem('jwtToken');
            localStorage.removeItem('jwtToken');

            // Redirect to the main page (adjust the route as needed)
            this.router.navigate(['/']);
            //this.router.navigate(['/user-gen']); // Redirect to login page
          }
          return throwError(() => error);
        })
      );



  }
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken.exp) {
        return false;
      }
      return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

}
