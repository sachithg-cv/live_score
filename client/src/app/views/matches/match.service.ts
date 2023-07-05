import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface MatchCreate {
    teams:string[];
}

@Injectable({
    providedIn:'root'
})
export class MatchService {

    constructor(private httpClient: HttpClient){

    }

    createMatch(match: MatchCreate) {
        return this.httpClient.post<any>(
            'http://localhost:3000/api/v1/matches',
            match
        );
    }
}