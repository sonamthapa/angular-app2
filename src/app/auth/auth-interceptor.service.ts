import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http'
import { AuthService } from './auth.service'; 
import { take, exhaustMap } from 'rxjs/operators';


@Injectable()

//attaching token with HttpInterceptor interface ko interceptor method
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}
    //we pipe user and http into one big observable
    //take -get currently activa user and unsubscribe automatically
    //exhaustMap- waits for first observable ie user observable to complete and 
    //gives us user now we return a new observable in inner body which replace previous observable in our entire chain observable
    intercept(req: HttpRequest<any>, next:HttpHandler) {
        return this.authService.user.pipe(
            take(1), exhaustMap( user =>{
                if(!user) {
                    return next.handle(req);
                }
                const modifiedReq =  req.clone({params: new HttpParams().set('auth',user.token)
            })
        return next.handle(modifiedReq)
    })
    )
    }
}

