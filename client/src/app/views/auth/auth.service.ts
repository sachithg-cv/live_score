import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap} from 'rxjs';
import { environment } from 'src/environments/environment';

interface SingupRequest {
    email: string;
    password: string;
}

interface SingupResponse {
    email: string;
    id: string;
}

interface SinginRequest {
    email: string;
    password: string;
}

interface SinginResponse {
    email: string;
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    signedin$ = new BehaviorSubject<any>(null);
    currentUser$ = new BehaviorSubject<any>(null);
    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {

    }

    signup(credentials: SingupRequest) {
        return this.httpClient.post<SingupResponse>(
            `${this.baseUrl}/user/signup`,
            credentials
        ).pipe(
            tap((data) => {
                this.signedin$.next(true);
                if (data && data.email) {
                    this.currentUser$.next(data.email);
                }
            })
        );
    }

    getCurrentUser() {
        return this.httpClient.get<any>(`${this.baseUrl}/user/currentuser`)
        .pipe(
            tap(({currentuser}) => {
                if (currentuser && currentuser.id && currentuser.email) {
                    this.signedin$.next(true);
                    const {email} = currentuser;
                    this.currentUser$.next(email);
                } else {
                    this.signedin$.next(false);
                }
            })
        );
    }

    signin(credentials: SinginRequest) {
        return this.httpClient.post<SinginResponse>(
            `${this.baseUrl}/user/signin`,
            credentials
        ).pipe(
            tap((data) => {
                this.signedin$.next(true);
                if (data && data.email) {
                    this.currentUser$.next(data.email);
                }
            })
        );
    }

    signout() {
        return this.httpClient.post(`${this.baseUrl}/user/signout`,{})
        .pipe(
            tap(() => {
                this.signedin$.next(false);
            })
        );
    }
}