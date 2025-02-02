import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';  // Import provideHttpClient
import { routes } from './app.routes';
import { SampleInterceptor } from './interceptors/SampleInterceptor';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Keep this as is
    provideRouter(routes),  // Keep this as is
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide:HTTP_INTERCEPTORS,
      useClass:SampleInterceptor,
      multi:true
    }
  ]
};
