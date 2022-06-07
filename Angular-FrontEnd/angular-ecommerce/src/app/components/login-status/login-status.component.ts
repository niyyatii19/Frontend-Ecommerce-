import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';
@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean;
  userFullName: string;
  browserStorage : Storage = sessionStorage;

  constructor(@Inject(OKTA_AUTH) private octaAuth: OktaAuth, private oktaAuthService: OktaAuthStateService) { }

  ngOnInit(): void {

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    );
  }
  getUserDetails() {
    if (this.isAuthenticated) {
      this.octaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name;
          const email = res.email;
          this.browserStorage.setItem('userEmail', JSON.stringify(email));
        }
      );
    }

  }

  logout() {
        this.octaAuth.signOut();
  }
}


