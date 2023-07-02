import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Player } from '../team-create/team-create.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

    @Input() players!: Player[];
    @Output() editPlayerEvent = new EventEmitter<number>();
    @Output() removePlayerEvent = new EventEmitter<number>();
    
    constructor() {}

    ngOnInit(): void {
    
    }

    editPlayer(index: number) :void {
        console.log("Edit Player", index);
        this.editPlayerEvent.emit(index);
    }

    removePlayer(index: number) :void {
        console.log("Remove Player", index);
        this.removePlayerEvent.emit(index);
    }

}