import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../commons/country';
import { State } from '../commons/state';

@Injectable({
  providedIn: 'root'
})
export class MonthYearFormService {
    backendUrl : string = environment.backendApiUrl;
   countriesUrl: string = this.backendUrl+'/countries';
    statesUrl : string = this.backendUrl+'/states';
  constructor(private httpClient: HttpClient) { }

  gettingCreditCardMonths(month: number): Observable<number[]>{
    let data: number[] = [];

    for(let theMonth= month; theMonth<= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCrditCardYear(): Observable<number[]>{
    let data: number[] = [];
    let startYear : number = new Date().getFullYear();
    let endYear: number = startYear+10;
    for(let theYear = startYear; theYear<= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }


  gettingCountries(): Observable<Country[]>{
    return this.httpClient.get<GetCountries>(this.countriesUrl).pipe(
      map(reponse => reponse._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]>{
    const searchUrl: string  = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetStates>(searchUrl).pipe(
       map(response => response._embedded.states)
    );
  } 
}

interface GetStates{
  _embedded:{
    states: State[]
  };
}

interface GetCountries{
  _embedded:{
    countries: Country[]
  };
}