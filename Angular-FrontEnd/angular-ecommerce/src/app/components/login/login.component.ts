import { Component, Inject, OnInit } from '@angular/core';
import appConfig from '../../config/my-app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuthService: OktaAuth, private oktaAuthStateService: OktaAuthStateService) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo2.png',
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes

      }

    });
  }

  ngOnInit(): void {

    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'
    }, // this name should be same as div tag id in login.component.html
      (response: { status: string; }) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();
        }
      },

      (error: any) => {
        throw error;
      }
    );
  }

}
