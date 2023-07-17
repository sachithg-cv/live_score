import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';
@Component({
    selector: "app-completed-match",
    templateUrl: 'completed-match.component.html',
    styleUrls: ['completed-match.component.scss']
})
export class CompletedMatchComponent implements OnInit {


    constructor(private route: ActivatedRoute) {
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));
        console.log(matchId);
    }

    ngOnInit(): void {

    }
}