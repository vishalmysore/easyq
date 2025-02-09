import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { generateUsername } from 'unique-username-generator';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthEventService } from './auth-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  protected username: string | undefined;
  constructor(private snackBar: MatSnackBar,private userService: UserService,private router: Router,private authEventService: AuthEventService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Intercepting Requests "+request.url)
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
    if (request.url.includes('/createNewTempUser')|| request.url.includes('/accounts.google.com') || request.url.includes('/auth/google') || request.url.includes('https://www.googleapis.com/oauth2/v3/certs')|| request.url.includes("markUserForRemoval")) {
      console.log("Skipping sending JWT back for new user for url "+request.url);
      if(request.url.includes("markUserForRemoval")) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(clonedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 500) { // Token expired or unauthorized
              console.warn('JWT expired. Redirecting to login...');
              // this.authService.logout(); // Clear session
              sessionStorage.removeItem('jwtToken');
              localStorage.removeItem('jwtToken');

              // Redirect to the main page (adjust the route as needed)
              this.snackBar.open('Your session has expired. Please refresh the page.', 'OK', {
                duration: 5000,  // Show for 5 seconds
                panelClass: ['snackbar-warning']
              });
              //this.router.navigate(['/user-gen']); // Redirect to login page
            }
            return throwError(() => error);
          })
        );
      } else {
        return next.handle(request);
      }
    }
    //let authReq = request;

    if (!token || this.isTokenExpired(token)) {
      console.log("token expired for user "+request.url);
      //sessionStorage.removeItem('jwtToken');
     // localStorage.removeItem('jwtToken');
      localStorage.removeItem('username');
      sessionStorage.removeItem('username');
     // this.authEventService.notifyAuthExpired();
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
          if (error.status === 500) { // Token expired or unauthorized
            console.warn('JWT expired. Redirecting to login...');
            // this.authService.logout(); // Clear session
            sessionStorage.removeItem('jwtToken');
            localStorage.removeItem('jwtToken');
           // this.authEventService.notifyAuthExpired();
            // Redirect to the main page (adjust the route as needed)
            this.snackBar.open('Your session has expired. Please refresh the page. Please signin to avoid this message in future', 'OK', {
              duration: 7000,
              panelClass: ['snackbar-warning'],
              horizontalPosition: 'center', // Centers it horizontally
              verticalPosition: 'top' ,// Moves it to the top (change this if needed)// Show for 5 seconds

            });
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
