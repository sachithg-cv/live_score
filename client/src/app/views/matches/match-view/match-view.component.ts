import { Component, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-match-view',
  templateUrl: './match-view.component.html',
  styleUrls: ['./match-view.component.scss']
})
export class MatchViewComponent implements OnInit {
    match:any;
    notifier = new Subject<void>();

    constructor(private route: ActivatedRoute, private matchService: MatchService){

    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));

        this.matchService.get(matchId)
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
           this.match = data;
        });
    }

    updateToss(event:any) {
        this.match = event;
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}