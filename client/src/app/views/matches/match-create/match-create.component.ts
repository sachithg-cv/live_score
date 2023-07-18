import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchCreate, MatchService } from '../match.service';
import { TeamResponse, TeamService } from '../../teams/team.service';
import { Subject, forkJoin, map, takeUntil } from 'rxjs';
import { selectedTeamValidator } from '../validators/selected-team-validator';
import { AppService } from '../../../app.service';
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
    notifier = new Subject<void>();
    teams: Team[] | undefined;
    globals: any;

    matchCreateForm = new FormGroup({
        team1: new FormControl('', Validators.required),
        team2: new FormControl('', Validators.required),
        wide: new FormControl('', Validators.required),
        noBall: new FormControl('', Validators.required),
        isIllegalDeliveryDiscarded: new FormControl(true, Validators.required),
        ballsPerOver: new FormControl('', Validators.required),
    }, { validators: selectedTeamValidator });

    constructor(private matchService: MatchService, private teamService: TeamService, private AppService: AppService, private router: Router) {
    }

    ngOnInit(): void {
        forkJoin([
            this.teamService.getAll(),
            this.AppService.getGlobals()
        ]).pipe(
            takeUntil(this.notifier),
            map((data: any) => {
                if (data && data.length && data[0].length > 0) {
                    const teams = data[0].map((team: TeamResponse) => {
                        return {
                            name: team.name,
                            id: team._id
                        }
                    });
                    return [teams, ...data[1]];
                }
                return [];
            }),
        )
            .subscribe((res) => {
                console.log(res);
                const val = [{ name: 'Select a Team', id: '' }, ...res[0]];
                this.teams = val;
                this.globals = res[1];
                const { wide, noBall, isIllegalDeliveryDiscarded, ballsPerOver } = this.globals.matchSetting;
                this.matchCreateForm.get('wide')?.setValue(wide);
                this.matchCreateForm.get('noBall')?.setValue(noBall);
                this.matchCreateForm.get('isIllegalDeliveryDiscarded')?.setValue(isIllegalDeliveryDiscarded);
                this.matchCreateForm.get('ballsPerOver')?.setValue(ballsPerOver);
            });

    }

    createMatch(): void {
        if (this.matchCreateForm.invalid) {
            return;
        }

        const { team1, team2, wide, noBall, isIllegalDeliveryDiscarded, ballsPerOver } = this.matchCreateForm.value;
        const req: MatchCreate = {
            teams: [team1 as string, team2 as string],
            settings: {
                wide,
                noBall,
                isIllegalDeliveryDiscarded,
                ballsPerOver
            }
        };

        this.matchService.createMatch(req)
            .subscribe({
                next: (res) => {
                    console.log(res);
                    const { wide, noBall, isIllegalDeliveryDiscarded, ballsPerOver } = this.globals.matchSetting;
                    this.matchCreateForm.reset({
                        team1: '',
                        team2: '',
                        wide: wide,
                        noBall: noBall,
                        isIllegalDeliveryDiscarded: isIllegalDeliveryDiscarded,
                        ballsPerOver: ballsPerOver
                    });
                    this.matchService.createMatchSubject.next();
                },
                error: (err) => {
                    if (!err.status) {
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

    cancel(): void {
        this.router.navigateByUrl("/");
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

}