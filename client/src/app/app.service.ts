import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn:'root'
})
export class AppService {
    baseUrl = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) {

    }

    getGlobals() {
        return this.httpClient.get<any>(
            `${this.baseUrl}/util/globals`
        );
    }
}
