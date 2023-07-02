import { Component, OnInit } from '@angular/core';

export interface Player{
    firstName: string;
    lastName: string;
    gender: string;
    isCaptain: boolean;
}

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {

    players:Player[] = [];

    constructor() {}

    ngOnInit(): void {
    }

    addPlayer(newPlayer: Player) {
        this.players.push(newPlayer);
    }

    removePlayer(index: number) :void {
        console.log(index);
        const newPlayers = this.players.filter((_,i) => i != index);
        this.players = newPlayers;
    }

    editPlayer(index: number) :void {
        console.log(index);
    }
}