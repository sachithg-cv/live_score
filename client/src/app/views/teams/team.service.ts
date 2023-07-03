import { Injectable } from '@angular/core';
import { Player } from './player.service';
import {HttpClient} from '@angular/common/http';

export interface TeamRequest {
    name:string;
    players: Player[];
}

@Injectable({
    providedIn:'root'
})
export class TeamService {
    
    constructor(private httpClient: HttpClient) {

    }

    submitTeam(team: TeamRequest) {
        return this.httpClient.post<any>(
            'http://localhost:3000/api/v1/teams',
            team
        );
    }
}