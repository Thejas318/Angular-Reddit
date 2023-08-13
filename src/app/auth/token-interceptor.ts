import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./shared/auth.service";
import { LoginResponse } from "./login/login-response";



@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor( private authService: AuthService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        
      const jwtToken = this.authService.getJwtToken();
      console.log('jwt token that is given by getjwt method: ', jwtToken)
        if(jwtToken) {
            this.addToken(req, jwtToken);
        }
        return next.handle(req).pipe(catchError(error => {
            if ( error instanceof HttpErrorResponse 
                && error.status === 403) {
                    return this.handleAuthErrors(req, next);
                } else {
                    return throwError(error);
                }
        }));
    }
    handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject.next(refreshTokenResponse.authenticationToken);
                return next.handle(this.addToken(req, 
                    refreshTokenResponse.authenticationToken));
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req,
                        this.authService.getJwtToken()))
                })
            );
        }
    }

    addToken(req: HttpRequest<any>, jwtToken: any):  HttpRequest<any> {
        console.log('Request before cloning:', req);
        const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
          });
        console.log('Request after cloning:', clonedRequest);
        return clonedRequest;
    }

    
}
