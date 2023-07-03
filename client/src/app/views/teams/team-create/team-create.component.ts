import { Component, OnInit } from '@angular/core';
import { Player } from '../player.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {

    players:Player[] = [];

    teamForm = new FormGroup({
        id: new FormControl('', [ Validators.required ]),
        name: new FormControl('', [ Validators.required ]),
        players: new FormControl<Player[]>([], [ Validators.required ]),
    });

    constructor(private router: Router, private teamService:TeamService) {}

    ngOnInit(): void {
    }

    addPlayer(newPlayer: Player) {
        const index = this.players.findIndex((player)=> player.id === newPlayer.id);
        if (index < 0) {
            this.players.push(newPlayer);
        } else {
            this.players[index] = newPlayer;
        }
    }

    removePlayer(id: string) :void {
        const newPlayers = this.players.filter((player) => player.id !== id);
        this.players = newPlayers;
    }

    submitTeam(): void {
        if (this.players.length === 0) {
            this.teamForm.setErrors({
                noPlayers: true
            });
            return;
        }

        let teamId = this.teamForm.get('id')?.value;
        if (teamId === '') {
            this.teamForm.patchValue({
                id: UUID.UUID()
            });
        }

        this.teamForm.patchValue({
            players: this.players
        });

        if (this.teamForm.invalid) {
            return;
        }
        const {name, players} = this.teamForm.value;
        this.teamService.submitTeam({
            name: name as string,
            players: players as Player[]
        }).subscribe((data) => {
            console.log(data);
            this.resetForm();
        })
    }

    cancel(): void{
        this.router.navigateByUrl("/");
    }

    resetForm() : void{
        this.players = [];

        this.teamForm.reset({
            id:'',
            name:'',
            players:[]
        });
    }
}