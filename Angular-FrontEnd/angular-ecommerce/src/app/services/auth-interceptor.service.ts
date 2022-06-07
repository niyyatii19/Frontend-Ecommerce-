import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { from, lastValueFrom, Observable } from 'rxjs';
import { OktaAuth } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleRequest(request, next));
  }
  
  private async handleRequest(request : HttpRequest<any>, next: HttpHandler): Promise<any> {
    const theEndPoint = environment.backendApiUrl +'/orders';
    const securedEndPoints = [theEndPoint];
    if(securedEndPoints.some(url => request.urlWithParams.includes(url))){
      const accessToken = await this.oktaAuth.getAccessToken();

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    return await lastValueFrom(next.handle(request));
  }

}
