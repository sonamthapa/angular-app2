import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError , tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    //store authenticated user
    //user = new Subject<User>()
    user = new BehaviorSubject<User>(null);
    private tokenexpirationTimer: any;
    //when we have new user ie login we (emit) and clear user when we log out

    constructor(private http: HttpClient,
                private router: Router){}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBD2s5eBmxZIoEdHFdZ_As9SEYlrTbPgds',
       {
           email: email,
           password: password,
           returnSecureToken: true
       })
        //tap operator performs action without changing response! ie Run code with the data we get back from observable
       .pipe(catchError(this.handleError),tap(resData=> {
          this.handleAuthentication(
              resData.email, 
              resData.localId, 
              resData.idToken,
              +resData.expiresIn)
       }));
       }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBD2s5eBmxZIoEdHFdZ_As9SEYlrTbPgds',
        {
            email: email,
            password: password,
            returnSecureToken: true
        })
       
        .pipe(catchError(this.handleError),tap(resData=> {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken,
                +resData.expiresIn)
         }));
        }

        autoLogin(){
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } =
            //convert it into js object
             JSON.parse(localStorage.getItem('userData'));
            if(!userData){
                return;
            } 
            //when we create new user we pass loaded data
            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );
            //new user with authenticated
            if(loadedUser.token){
                this.user.next(loadedUser)
                const expirationDuration =  new Date(userData._tokenExpirationDate).getTime()- new Date().getTime()
            }
        }
        logout() {
            this.user.next(null);
            this.router.navigate(['/auth']);
            localStorage.removeItem('userData');
            if(this.tokenexpirationTimer){
                clearTimeout(this.tokenexpirationTimer)
            }
            this.tokenexpirationTimer = null;
        }
        //set timer for  tokaen when we store and when it expires
        autoLogout(expirationDuration: number) {
            console.log(expirationDuration)
            this.tokenexpirationTimer = setTimeout(() => {
                this.logout();
            },expirationDuration);
        }

    private handleAuthentication(
        email: string, 
        token: string,
        userId: string,
        expiresIn: number
        ) {
        const expirationDate = new Date(new Date(new Date().getTime()+ +expiresIn * 1000));
        //create new user
        const user = new User(email, userId ,token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        //persist token when page reload
        localStorage.setItem('userData',JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
        }
        return throwError(errorMessage)
    }
}