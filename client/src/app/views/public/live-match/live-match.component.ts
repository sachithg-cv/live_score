import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';
import { PublicService } from '../public.service';
@Component({
    selector: "app-live-match",
    templateUrl: 'live-match.component.html',
    styleUrls: ['live-match.component.scss']
})
export class LiveMatchComponent implements OnInit {

    notifier = new Subject<void>();
    tossSummaryLine: string = "";
    liveInningId!: string;
    liveInningType!: string;
    otherInningId!: string;
    otherInningType!: string
    roomId!: string;
    teamNames: any = [];
    isDataLoaded: boolean =false;
    matchSettings: any;

    constructor(private route: ActivatedRoute, private publicService: PublicService) {
    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));

        this.publicService.getLiveMatch(matchId)
            .pipe(
                takeUntil(this.notifier),
            )
            .subscribe((data) => {
                console.log(data);
                const { status, toss, firstInning, secondInning, roomId, teams, settings } = data;
                const { name, isBatFirst } = toss;
                this.tossSummaryLine = `${name} has won the toss and elected to ${isBatFirst ? 'bat first' : 'bowl first'}.`;

                if (status === "first_inning_started") {
                    this.liveInningId = firstInning
                    this.liveInningType = "First Innings";
                } else if (status === "second_inning_started") {
                    this.liveInningId = secondInning;
                    this.liveInningType = "Second Innings";
                    this.otherInningId = firstInning;
                    this.otherInningType = "First Innings";
                }
                this.roomId = roomId;
                this.teamNames = teams.map((val: any) => val.name);
                this.matchSettings = settings;
                this.isDataLoaded = true;
            });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}