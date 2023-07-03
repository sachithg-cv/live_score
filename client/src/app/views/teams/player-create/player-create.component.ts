import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Player, PlayerService } from '../player.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-player-create',
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.scss']
})
export class PlayerCreateComponent implements OnInit {
    notifier = new Subject<void>();
    @Output() newPlayerEvent = new EventEmitter<Player>();
    editingPlayer!: Player;

    playerForm = new FormGroup({
        id: new FormControl('', [ Validators.required ]),
        firstName: new FormControl('', [ Validators.required ]),
        lastName: new FormControl('', [ Validators.required ]),
        isCaptain: new FormControl(false, [ Validators.required ]),
        gender: new FormControl('Male', [ Validators.required ]),
    });

    constructor(private playerService: PlayerService) {}

    ngOnInit(): void {
        this.playerService.createPlayerSubject
        .pipe(takeUntil(this.notifier))
        .subscribe((player:Player) => {
            this.editingPlayer = player;
            this.playerForm.setValue(this.editingPlayer);
        });
    }

    addNewPlayer() {
        let playerId = this.playerForm.get('id')?.value;
        if (playerId === '') {
            this.playerForm.patchValue({
                id: UUID.UUID()
            });
        }

        if (this.playerForm.invalid) {
            return;
        }
        const {id, firstName, lastName, isCaptain, gender} = this.playerForm.value;
        this.newPlayerEvent.emit({
            id: id as string,
            firstName: firstName as string,
            lastName: lastName as string,
            isCaptain: isCaptain as boolean,
            gender: gender as string
        });

        this.resetForm();
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

    resetForm() :void{
        this.playerForm.reset({
            firstName:'',
            gender:'Male',
            id:'',
            isCaptain:false,
            lastName:''
        });
    }

}