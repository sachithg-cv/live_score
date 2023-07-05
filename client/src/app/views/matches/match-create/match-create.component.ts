import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatchCreate, MatchService} from '../match.service';
import { TeamResponse, TeamService } from '../../teams/team.service';
import { map } from 'rxjs';
import { selectedTeamValidator} from '../validators/selected-team-validator';

interface Team {
    name: string;
    id: string;
}

@Component({
  selector: 'app-match-create',
  templateUrl: './match-create.component.html',
  styleUrls: ['./match-create.component.scss']
})
export class MatchCreateComponent implements OnInit {
    teams: Team[] | undefined;

    matchCreateForm = new FormGroup({
        team1: new FormControl('',Validators.required),
        team2: new FormControl('',Validators.required)
    },{ validators: selectedTeamValidator});

    constructor(private matchService: MatchService, private teamService: TeamService, private router: Router) {
    }

    ngOnInit(): void {
        this.teamService.getAll().pipe(
            map((data: TeamResponse[]) => {
                if (data && data.length > 0){
                    return data.map((team:TeamResponse)=>{
                        return {
                            name: team.name,
                            id: team._id
                        }
                    });
                }
                return [];
            })
        ).subscribe((data) => {
            const val = [{name:'Select a Team', id:''}, ...data];
            this.teams = val;

        });
    }

    createMatch(): void{
        if (this.matchCreateForm.invalid) {
            return;
        }

        const {team1, team2} = this.matchCreateForm.value;
        const req: MatchCreate = {
            teams:[team1 as string, team2 as string]
        };

        this.matchService.createMatch(req)
        .subscribe({
            next: (res) => { 
                console.log(res);
                this.matchCreateForm.reset({
                    team1:'',
                    team2:''
                });
            },
            error: (err) => {
                if(!err.status) {
                    this.matchCreateForm.setErrors({
                        noConnection: true
                    });
                } else {
                    this.matchCreateForm.setErrors({
                        unknownError: true
                    })
                }
            }
        });
    }

    cancel(): void{
        this.router.navigateByUrl("/");
    }

}