import {inject, Injectable, signal} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import { authConfig } from './auth.config';
import {environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

   constructor(private oAuthService: OAuthService, private http: HttpClient) {
     this.initConfiguration();
   }
    profile = signal<any>(null);



    initConfiguration() {
      this.oAuthService.configure(authConfig);
      this.oAuthService.setupAutomaticSilentRefresh();
      this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        if (this.oAuthService.hasValidIdToken()) {
          this.profile.set(this.oAuthService.getIdentityClaims());
        }
      });


    }

    login() {
      this.oAuthService.initImplicitFlow();

    }


    logout() {
      this.oAuthService.revokeTokenAndLogout();
      this.oAuthService.logOut();
      this.profile.set(null);
    }

    getProfile() {
      return this.profile();
    }

  getAccessToken() {
    return this.oAuthService.getAccessToken();
  }
}
