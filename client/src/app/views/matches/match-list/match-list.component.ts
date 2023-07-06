import { Component, OnInit } from '@angular/core';
import { MatchResponse, MatchService} from '../match.service';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
    notifier = new Subject<void>();
    matches:MatchResponse[] = [];
    
    constructor(private matchService: MatchService) {

    }

    ngOnInit(): void {
        this.getAll();
    }

    viewMatch(index:number): void{

    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

    getAll() {
        this.matchService.getAll()
        .pipe(
            map((data)=>{
                if (data && data.length > 0) {
                    return data.map((match:any)=>{
                        return {
                            id:match._id,
                            team1: match.teams[0].name,
                            team2: match.teams[1].name,
                            status: match.status,
                            isLive: match.isLive
                        }
                    })
                }
                return [];
            }),
            takeUntil(this.notifier)
        )
        .subscribe((data: MatchResponse[])=>{
            console.log(data);
            this.matches = data;
        });
    }
}