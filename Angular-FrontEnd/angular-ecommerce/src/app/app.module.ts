import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent
} from '@okta/okta-angular';
import myAppConfig from './config/my-app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { MembersComponent } from './components/members/members.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
const oktaConfig = Object.assign({

  onAuthRequired: (_oktaAuth: any, injector: { get: (arg0: typeof Router) => any; }) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }

}, myAppConfig.oidc);



const oktaAuth = new OktaAuth(oktaConfig);
function onAuthRequired(_oktaAuth: any, injector: { get: (arg0: typeof Router) => any; }) {
  // Use injector to access any service available within your application
  const router = injector.get(Router);
 
  // Redirect the user to your custom login page
  router.navigate(['/custom-login']);
}

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CardDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ ProductService, { provide: OKTA_CONFIG, useValue: {oktaAuth, onAuthRequired} },
                {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
