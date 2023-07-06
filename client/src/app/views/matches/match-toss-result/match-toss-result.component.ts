import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Team {
    id: any;
    name: string;
}

@Component({
  selector: 'app-match-toss-result',
  templateUrl: './match-toss-result.component.html',
  styleUrls: ['./match-toss-result.component.scss']
})
export class MatchTossResultComponent implements OnInit {
    @Input() teams!:any;
    @Input() status!:string;
    @Input() matchId!:string;
    @Input() tossResult!: any;

    @Output() tossUpdateEvent = new EventEmitter<any>();

    tossSummaryLine!: string;
    notifier = new Subject<void>();
    teamsFiltered:Team[] = [];

    matchTossResultForm = new FormGroup({
        winningTeamId: new FormControl(null, Validators.required),
        isBatFirst: new FormControl(true, Validators.required)
    });

    constructor(private matchService: MatchService, private router:Router){

    }
    
    ngOnInit(): void {

        if (this.teams && this.teams.length > 0) {
            console.log(this.teams);
            const team = this.teams.map((team:any)=>{
                return {
                    id: team._id,
                    name: team.name
                }
            });

            this.teamsFiltered = [
                {id:null, name:'Select the team'},
                ...team
            ]
        }

        if (this.tossResult) {
            const {name, isBatFirst} = this.tossResult;
            this.tossSummaryLine = `${name} has won the toss and elected to ${isBatFirst?'bat first':'bowl first'}.`;
        }
    }

    cancel(): void{
        this.router.navigateByUrl("/");
    }

    updateTossResult(): void{
        if (this.matchTossResultForm.invalid) {
            return;
        }

        const {winningTeamId, isBatFirst} = this.matchTossResultForm.value;

        const winningTeam = this.teamsFiltered.find((val)=> val.id && val.id === winningTeamId);
        const otherTeam = (this.teamsFiltered.filter((val)=> val.id && val.id !== winningTeamId ))[0];

        this.matchService.updateTossResult(this.matchId,{
            isBatFirst: isBatFirst as boolean,
            winningTeamId: winningTeamId! as string,
            winningTeamName: winningTeam?.name as string,
            otherTeamId: otherTeam.id
        })
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            const {toss} = data;
            const {name, isBatFirst} = toss;
            this.tossSummaryLine = `${name} has won the toss and elected to ${isBatFirst?'bat first':'bowl first'}.`;
            this.tossUpdateEvent.emit(data);
        });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}