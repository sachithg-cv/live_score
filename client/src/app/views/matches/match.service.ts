import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MatchCreate {
    teams:string[];
    settings: any
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
    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient){

    }

    createMatch(match: MatchCreate) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/matches`,
            match
        );
    }

    getAll() {
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches`
        );
    }

    get(matchId: string) {
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}`
        );
    }

    updateTossResult(matchId: string, payload: TossUpdate) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/matches/${matchId}/toss`,
            payload
        );
    }

    startFirstInning(matchId: string){
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}/firstInning/start`
        );
    }

    endFirstInning(matchId: string){
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}/firstInning/end`
        );
    }

    startSecondInning(matchId: string){
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}/secondInning/start`
        );
    }

    endSecondInning(matchId: string){
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}/secondInning/end`
        );
    }

    getLiveMatches() {
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/live`
        );
    }

    getInnings(matchId: string) {
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}/innings`
        );
    }

    submitDelivery(inningId:string, payload:any) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/innings/${inningId}/deliveries`,
            payload
        );
    }

    endOver(inning: string) {
        return this.httpClient.get<any>(
            `${this.baseUrl}/innings/${inning}/endover`
        );
    }

    editDelivery(inningId:string, deliveryId: string, payload: any) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/innings/${inningId}/deliveries/${deliveryId}`,
            payload
        );
    }

    removeDelivery(inningId:string, deliveryId: string, payload: any) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/innings/${inningId}/deliveries/${deliveryId}/remove`,
            payload
        );
    }

    completeMatch(matchId: string, payload:any){
        return this.httpClient.post<any>(
            `${this.baseUrl}/matches/${matchId}/secondInning/end`,
            payload
        );
    }

    changeMatchSettings(matchId: string, payload: any) {
        return this.httpClient.post<any>(
            `${this.baseUrl}/matches/${matchId}/settings`,
            payload
        );
    }

    deleteMatch(matchId: string) {
        return this.httpClient.get<any>(
            `${this.baseUrl}/matches/${matchId}/delete`
        );
    }
}