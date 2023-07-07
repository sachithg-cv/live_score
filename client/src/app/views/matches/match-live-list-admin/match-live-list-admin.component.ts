import { Component, Input, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-match-live-list-admin',
  templateUrl: './match-live-list-admin.component.html',
  styleUrls: ['./match-live-list-admin.component.scss']
})
export class MatchLiveListAdminComponent implements OnInit {

    notifier = new Subject<void>();
    matches:any = [];
    
    constructor(private matchService: MatchService) {

    }

    ngOnInit(): void {
        this.matchService.getLiveMatches()
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
        .subscribe((data)=>{
            console.log(data);
            this.matches = data;
        });
    }


    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}