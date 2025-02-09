import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from '../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  clientId: `${environment.googleClientId}`,
  redirectUri: window.location.origin,
  scope: 'openid profile email',
};
