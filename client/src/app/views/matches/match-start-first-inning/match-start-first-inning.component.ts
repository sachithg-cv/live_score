import { Component, Input, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-match-start-first-inning',
  templateUrl: './match-start-first-inning.component.html',
  styleUrls: ['./match-start-first-inning.component.scss']
})
export class MatchStartFirstInningComponent implements OnInit {

    @Input() status!:string;
    @Input() matchId!:string;
    notifier = new Subject<void>();
    
    constructor(private matchService: MatchService) {

    }
    ngOnInit(): void {
    }

    start(): void{
        this.matchService.startFirstInning(this.matchId)
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            const {status} = data;
            this.status = status;

            //navigate to match score view
        });
    }

    end(): void{
        this.matchService.endFirstInning(this.matchId)
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