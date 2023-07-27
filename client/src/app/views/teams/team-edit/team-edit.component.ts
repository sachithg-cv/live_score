import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../player.service';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent implements OnInit {

    notifier = new Subject<void>();
    teamId:any;
    players:Player[] = [];

    constructor(private teamService: TeamService, private route: ActivatedRoute, private router:Router) {

    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const teamId = String(routeParams.get('teamId'));
        console.log(teamId);
        this.teamId = teamId;
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
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

    submitPlayers() {
        if (this.players.length === 0) {
            return;
        }
        const req= {
            players: this.players
        };

        this.teamService.addPlayers(this.teamId,req)
        .pipe(takeUntil(this.notifier))
        .subscribe((_)=>{
            this.router.navigateByUrl("/teams");
        });

        
    }

    cancel(): void{
        this.router.navigateByUrl("/teams");
    }
}