import { Component, Input, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-match-score',
  templateUrl: './match-score.component.html',
  styleUrls: ['./match-score.component.scss']
})
export class MatchScoreComponent implements OnInit {

    notifier = new Subject<void>();
    match:any;

    constructor(private route: ActivatedRoute, private matchService: MatchService) {

    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));
        this.match = matchId;
        
    }


    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}