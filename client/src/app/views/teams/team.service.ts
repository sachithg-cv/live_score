import { Injectable } from '@angular/core';
import { Player } from './player.service';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    baseUrl = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) {

    }

    submitTeam(team: TeamRequest) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/teams`,
            team
        );
    }

    getAll() {
        return this.httpClient.get<TeamResponse[]>(
            `${this.baseUrl}/teams`
        );
    }
}