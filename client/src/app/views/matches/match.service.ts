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

    startFirstInning(matchId: string){
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/${matchId}/firstInning/start`
        );
    }

    endFirstInning(matchId: string){
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/${matchId}/firstInning/end`
        );
    }

    startSecondInning(matchId: string){
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/${matchId}/secondInning/start`
        );
    }

    endSecondInning(matchId: string){
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/${matchId}/secondInning/end`
        );
    }

    getLiveMatches() {
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/live`
        );
    }

    getInnings(matchId: string) {
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/matches/${matchId}/innings`
        );
    }

    submitDelivery(inningId:string, payload:any) {
        return this.httpClient.post<any>(
            `http://localhost:3000/api/v1/innings/${inningId}/deliveries`,
            payload
        );
    }

    endOver(inning: string) {
        return this.httpClient.get<any>(
            `http://localhost:3000/api/v1/innings/${inning}/endover`
        );
    }

    editDelivery(inningId:string, deliveryId: string, payload: any) {
        return this.httpClient.post<any>(
            `http://localhost:3000/api/v1/innings/${inningId}/deliveries/${deliveryId}`,
            payload
        );
    }
}