import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Player, PlayerService } from '../player.service'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
    @Input() players!: Player[];
    @Output() removePlayerEvent = new EventEmitter<string>();
    
    constructor(private playerService: PlayerService) {}

    ngOnInit(): void {
    
    }

    editPlayer(index: number) :void {
        this.playerService.createPlayerSubject.next(this.players[index]);
    }

    removePlayer(index: number) :void {
        this.removePlayerEvent.emit(this.players[index].id);
    }
}