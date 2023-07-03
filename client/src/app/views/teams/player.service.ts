import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Player{
    id:string;
    firstName: string;
    lastName: string;
    gender: string;
    isCaptain: boolean;
}

@Injectable({
    providedIn:'root'
})
export class PlayerService {
    createPlayerSubject = new Subject<Player>();
}