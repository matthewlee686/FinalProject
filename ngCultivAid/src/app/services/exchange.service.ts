import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exchange } from '../models/exchange';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExchangeItem } from '../models/exchange-item';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  //////////
  //Fields

    // private baseUrl = 'http://localhost:8095/';
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private auth: AuthService) { }

  ///////////
  //Methods

  getBuyerExchanges(): Observable<Exchange[]> {
    return this.http.get<Exchange[]>(this.baseUrl + 'api/exchanges/buyer', this.getHttpOptions())
    .pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError('ExchangeService.getBuyerExchanges(): error getting buyer exchanges.');
      })
    );
  }

  getSellerExchanges(): Observable<Exchange[]> {
    return this.http.get<Exchange[]>(this.baseUrl + 'api/exchanges/seller', this.getHttpOptions())
    .pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError('ExchangeService.getSellerExchanges(): error getting seller exchanges.');
      })
    );
  }

  getSellerExchangesByUser(user: User): Observable<Exchange[]> {
    return this.http.get<Exchange[]>(this.baseUrl + 'exchanges/seller/' + user.id, this.getHttpOptions())
    .pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError('ExchangeService.getSellerExchangesByUser(): error getting seller exchanges.');
      })
    );
  }

  createExchange(exchangeItems: ExchangeItem[]) {
    return this.http.post<Exchange>(this.baseUrl + 'api/exchanges/', exchangeItems, this.getHttpOptions())
      .pipe(
        catchError((err: any) => {
          console.log(err);
          return throwError('ExchangeService.createExchange(): error creating exchange');
        })
      );
  }

  updateExchange(exchange: Exchange){
    return this.http.put<Exchange>(this.baseUrl + 'api/exchanges/', exchange, this.getHttpOptions())
    .pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError('ExchangeService.updateExchange(): error updating exchange.');
      })
    );
  }

  // getHttpOptions() {
  //   const credentials = this.auth.getCredentials();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Requested-With': 'XMLHttpRequest',
  //       'Authorization': `Basic ${credentials}`
  //     }),
  //   };
  //   return httpOptions;
  // }

  getHttpOptions() {
    const credentials = this.auth.getCredentials();
    if (credentials) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Basic ${credentials}`
        }),
      };
      return httpOptions;
    }
    else {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }),
      };
      return httpOptions;
    }
  }

}
