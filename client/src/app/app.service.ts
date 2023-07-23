import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class AppService {
    matches$ = new Subject<any>();

    baseUrl = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) {

    }

    getGlobals() {
        return this.httpClient.get<any>(
            `${this.baseUrl}/util/globals`
        );
    }

    getGlobalsPublic() {
        return this.httpClient.get<any>(
            `${this.baseUrl}/public/globals`
        );
    }

}
