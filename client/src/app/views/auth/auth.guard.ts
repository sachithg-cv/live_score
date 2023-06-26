import { Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment, UrlTree, Router, CanMatch, CanActivateFn, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable, skipWhile, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad{
    constructor(private authService: AuthService, private router: Router) {

    }

    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.signedin$.pipe(
            skipWhile(value => value === null),
            take(1),
            tap((isSignedIn)=>{
                if(!isSignedIn) {
                    this.router.navigateByUrl("/signin");
                }
            })
        );
    }

}