import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

declare let gtag: Function; // Ensure `gtag` is available

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
    importProvidersFrom(
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: [`${environment.authUrl}google`],
          sendAccessToken: true
        }
      })
    ),
    OAuthService,
    {
      provide: 'analytics',
      useFactory: (router: Router) => {
        router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            gtag('config', 'G-Q6PTR943Y3', { 'page_path': event.urlAfterRedirects });
          }
        });
      },
      deps: [Router]
    }
  ]
};
