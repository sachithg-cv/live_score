import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PublicService } from '../public.service';

@Component({
    selector: 'app-other-inning',
    templateUrl: 'other-inning.component.html',
    styleUrls: ['other-inning.component.scss']
})
export class OtherInningComponent implements OnInit {

    notifier = new Subject<void>();
    @Input() inningId!: string;
    @Input() inningType!: string;
    @Input() matchSettings!: any;

    liveScore!: any;
    batting: any;
    bowling: any;
    batsmen: any;
    bowlers: any;
    currentOver: any = [];
    previousOver: any = [];
    currentOverNumber: any;
    previousOverNumber: any;
    room: any;
    over!: string;


    constructor(private publicService: PublicService) {
    }


    ngOnInit(): void {
        this.publicService.getInning(this.inningId)
            .pipe(
                takeUntil(this.notifier),
            )
            .subscribe((data) => {
                console.log(data);
                const { liveScore, batting, bowling, batsmen, bowlers, currentOver, lastOvers } = data;
                this.batting = batting;
                this.bowling = bowling;

                this.batsmen = batsmen;
                this.bowlers = bowlers;
                this.mapLiveScore(liveScore[0]);
                this.mapOvers(currentOver, lastOvers);
            });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

    mapOvers(currentOver: number, lastOvers: any[]): void {
        this.previousOverNumber = currentOver;
        this.currentOverNumber = currentOver + 1;
        if (lastOvers && lastOvers.length > 0) {
            this.previousOver = lastOvers.filter((val) => val.over === this.previousOverNumber);
            this.currentOver = lastOvers.filter((val) => val.over === this.currentOverNumber);
        }
    }

    mapLiveScore(liveScore: any): void {
        this.liveScore = liveScore;
        const numberOfBalls = liveScore?.balls
        const ballsPerOver = this.matchSettings.ballsPerOver;
        this.over = Math.floor(numberOfBalls / ballsPerOver) + '.' + numberOfBalls % ballsPerOver;
    }
}