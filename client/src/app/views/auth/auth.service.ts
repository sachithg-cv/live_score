import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap} from 'rxjs';

interface SingupRequest {
    email: string;
    password: string;
}

interface SingupResponse {
    email: string;
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    signedin$ = new BehaviorSubject<boolean>(false);

    constructor(private httpClient: HttpClient) {

    }

    signup(credentials: SingupRequest) {
        return this.httpClient.post<SingupResponse>(
            'http://localhost:3000/api/v1/user/signup',
            credentials
        ).pipe(
            tap(() => {
                this.signedin$.next(true);
            })
        );
    }

    getCurrentUser() {
        return this.httpClient.get<any>('http://localhost:3000/api/v1/user/currentuser')
        .pipe(
            tap((res) => {
                if (res && res.id && res.email) {
                    this.signedin$.next(true);
                }
            })
        );
    }
}