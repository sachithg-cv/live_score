import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';

export interface MatchCreate {
    teams:string[];
}

export interface MatchResponse {
    id: string;
    team1: string;
    team2: string;
    status: string;
    isLive: boolean;
}

export interface TossUpdate {
    winningTeamName: string;
    winningTeamId: string; 
    isBatFirst: boolean;
    otherTeamId: string;
}

@Injectable({
    providedIn:'root'
})
export class MatchService {

    createMatchSubject = new Subject<void>();

    constructor(private httpClient: HttpClient){

    }

    createMatch(match: MatchCreate) {
        return this.httpClient.post<any>(
            'http://localhost:3000/api/v1/matches',
            match
        );
    }

    getAll() {
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches`
        );
    }

    get(matchId: string) {
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/${matchId}`
        );
    }

    updateTossResult(matchId: string, payload: TossUpdate) {
        return this.httpClient.post<any>(
            `http://localhost:3000/api/v1/matches/${matchId}/toss`,
            payload
        );
    }
}