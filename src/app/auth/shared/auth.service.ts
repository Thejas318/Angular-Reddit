import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignuprequestPayload } from '../signup/signup-request-payload';
import { Observable, map, tap } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request-payload';
import { LoginResponse } from '../login/login-response';
import { LocalStorageService } from 'ngx-webstorage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signUpUrl = 'http://localhost:8080/api/auth/signup';
  logInUrl = 'http://localhost:8080/api/auth/login';
  refreshTokenUrl = 'http://localhost:8080/api/auth/refresh/token';

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) { 

  }

  signUp(signUpRequestPayload: SignuprequestPayload): Observable<any> {

    return this.httpClient.post(this.signUpUrl, signUpRequestPayload, { responseType: 'text' });
  }

  logIn(loginRequestPayload: LoginRequestPayload): Observable<boolean> {

    return this.httpClient.post<LoginResponse>(this.logInUrl, loginRequestPayload)
    .pipe(
      map( response => {
        this.localStorage.store('authenticationToken', response.authenticationToken);
        this.localStorage.store('refreshToken', response.refreshToken);
        this.localStorage.store('expiresAt', response.expiresAt);
        this.localStorage.store('userName', response.userName);
        return true;
      })
    );
  }

  getJwtToken(){
    const jwttoken = this.localStorage.retrieve('authenticationToken');
    console.log('getJwtToken method called, the jwt token is: ', jwttoken);
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken(){
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      userName: this.getUserName()
    }

    return this.httpClient.post<LoginResponse>(this.refreshTokenUrl, refreshTokenPayload)
    .pipe(tap(
      response => {
        this.localStorage.store('authenticationToken', response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }
    ))
  }

  getRefreshToken() {
    const refreshtoken = this.localStorage.retrieve('refreshToken');
    console.log('Refresh token: ', refreshtoken)
    return this.localStorage.retrieve('refreshToken');
  }

  getUserName(){
    return this.localStorage.retrieve('userName')
  }

}

