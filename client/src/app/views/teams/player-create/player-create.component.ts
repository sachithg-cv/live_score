import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Player } from '../team-create/team-create.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-player-create',
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.scss']
})
export class PlayerCreateComponent implements OnInit {

    @Output() newPlayerEvent = new EventEmitter<Player>();

    playerForm = new FormGroup({
        firstName: new FormControl('', [ Validators.required ]),
        lastName: new FormControl('', [ Validators.required ]),
        isCaptain: new FormControl(false, [ Validators.required ]),
        gender: new FormControl('Male', [ Validators.required ]),
    });

    constructor() {}

    ngOnInit(): void {
    
    }

    addNewPlayer() {
        if (this.playerForm.invalid) {
            return;
        }
        const {firstName, lastName, isCaptain, gender} = this.playerForm.value;
        this.newPlayerEvent.emit({
            firstName: firstName as string,
            lastName: lastName as string,
            isCaptain: isCaptain as boolean,
            gender: gender as string
        });
    }

}