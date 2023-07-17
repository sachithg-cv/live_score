import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn:'root'
})
export class PublicService {
    baseUrl = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) {

    }

    getLiveMatch(matchId: string) {
        return this.httpClient.get<any>(
            `${this.baseUrl}/public/live/${matchId}`
        );
    }

    getInning(inningId: string) {
        return this.httpClient.get<any>(
            `${this.baseUrl}/public/innings/${inningId}`
        );
    }
}
