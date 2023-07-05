import { Injectable } from '@angular/core';
import { Player } from './player.service';
import {HttpClient} from '@angular/common/http';

export interface TeamRequest {
    name:string;
    players: Player[];
}

export interface TeamResponse {
    _id: string;
    name: string;
    players:TeamPlayer[];
}

export interface TeamPlayer {
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    isCaptain: boolean;
    isDeleted: boolean;
    createdOn: string;
    updatedOn: string;
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

    getAll() {
        return this.httpClient.get<TeamResponse[]>(
            'http://localhost:3000/api/v1/teams'
        );
    }
}