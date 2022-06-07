import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import { OktaAuth } from '@okta/okta-auth-js';



import {

  OKTA_CONFIG,

  OktaAuthModule,

  OktaCallbackComponent,
  OktaAuthGuard

} from '@okta/okta-angular';



import myAppConfig from './config/my-app-config';
import { LoginComponent } from './components/login/login.component';
import { MembersComponent } from './components/members/members.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const oktaConfig = Object.assign({

  onAuthRequired: (_oktaAuth: any,injector: { get: (arg0: typeof Router) => any; }) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }

}, myAppConfig.oidc);
const oktaAuth = new OktaAuth(oktaConfig);


//order of routes is important start from top down to generic
const routes: Routes = [
  { path: "order-history", component: OrderHistoryComponent, canActivate: [OktaAuthGuard] },
  { path: "members", component: MembersComponent, canActivate: [OktaAuthGuard] },
  { path: "login/callback", component: OktaCallbackComponent },
  { path: "login", component: LoginComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "cart-details", component: CardDetailsComponent },
  { path: "products/:id", component: ProductDetailsComponent },
  { path: "search/:keyword", component: ProductListComponent },
  { path: "category/:id", component: ProductListComponent },
  { path: "category", component: ProductListComponent },
  { path: "products", component: ProductListComponent },
  { path: " ", redirectTo: "/products", pathMatch: 'full' },
  { path: "**", redirectTo: '/products', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
