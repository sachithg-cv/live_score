import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-match-view',
    templateUrl: './match-view.component.html',
    styleUrls: ['./match-view.component.scss']
})
export class MatchViewComponent implements OnInit {
    match: any;
    notifier = new Subject<void>();

    matchSettingsForm = new FormGroup({
        wide: new FormControl('', Validators.required),
        noBall: new FormControl('', Validators.required),
        isIllegalDeliveryDiscarded: new FormControl(true, Validators.required),
        ballsPerOver: new FormControl('', Validators.required),
    });

    constructor(private route: ActivatedRoute, private matchService: MatchService, private router:Router) {

    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));

        this.matchService.get(matchId)
            .pipe(takeUntil(this.notifier))
            .subscribe((data) => {
                this.match = data;
                this.matchSettingsForm.setValue({
                    ballsPerOver: data?.settings.ballsPerOver,
                    isIllegalDeliveryDiscarded: data?.settings.isIllegalDeliveryDiscarded,
                    noBall: data?.settings.noBall,
                    wide: data?.settings.wide,
                });
            });
    }

    updateToss(event: any) {
        this.match = event;
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

    submitMatchSettings(): void {
        if (this.matchSettingsForm.invalid) {
            return;
        }

        const { wide, noBall, isIllegalDeliveryDiscarded, ballsPerOver } = this.matchSettingsForm.value;
        const req = {
            wide,
            noBall,
            isIllegalDeliveryDiscarded,
            ballsPerOver
        };

        this.matchService.changeMatchSettings(this.match._id, req)
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            this.matchSettingsForm.setValue({
                ballsPerOver: data?.ballsPerOver,
                isIllegalDeliveryDiscarded: data?.isIllegalDeliveryDiscarded,
                noBall: data?.noBall,
                wide: data?.wide,
            });
        });
    }

    deleteMatch(): void{
        this.matchService.deleteMatch(this.match._id)
        .pipe(takeUntil(this.notifier))
        .subscribe((_)=>{
            this.router.navigateByUrl("/matches/list");
        });
    }
}