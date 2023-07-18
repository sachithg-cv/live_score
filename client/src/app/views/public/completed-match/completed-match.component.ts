import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PublicService } from '../public.service';
@Component({
    selector: "app-completed-match",
    templateUrl: 'completed-match.component.html',
    styleUrls: ['completed-match.component.scss']
})
export class CompletedMatchComponent implements OnInit {

    notifier = new Subject<void>();
    tossSummaryLine: string = "";
    firstInningId!: string;
    firstInningType!: string;
    secondInningId!: string;
    secondInningType!: string
    teamNames: any = [];
    isDataLoaded: boolean = false;
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
                const { toss, firstInning, secondInning, teams, settings } = data;
                const { name, isBatFirst } = toss;
                this.tossSummaryLine = `${name} has won the toss and elected to ${isBatFirst ? 'bat first' : 'bowl first'}.`;
                this.firstInningId = firstInning
                this.firstInningType = "First Innings";
                this.secondInningId = secondInning;
                this.secondInningType = "Second Innings";
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