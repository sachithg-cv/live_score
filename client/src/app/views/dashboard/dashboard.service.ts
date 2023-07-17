import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn:'root'
})
export class DashboardService {
    baseUrl = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) {

    }

    getMatches() {
        return this.httpClient.get<any>(
            `${this.baseUrl}/public/matches`
        );
    }
}
