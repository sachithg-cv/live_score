import { Component, Input, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-match-start-second-inning',
  templateUrl: './match-start-second-inning.component.html',
  styleUrls: ['./match-start-second-inning.component.scss']
})
export class MatchStartSecondInningComponent implements OnInit {

    @Input() status!:string;
    @Input() matchId!:string;
    notifier = new Subject<void>();
    
    constructor(private matchService: MatchService) {

    }
    ngOnInit(): void {
    }

    start(): void{
        this.matchService.startSecondInning(this.matchId)
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            const {status} = data;
            this.status = status;

            //navigate to match score view
        });
    }

    end(): void{
        this.matchService.endSecondInning(this.matchId)
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            const {status} = data;
            this.status = status;
        });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}