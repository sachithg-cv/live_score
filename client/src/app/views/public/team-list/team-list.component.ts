import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PublicService } from '../public.service';

@Component({
    selector: "app-team-list",
    templateUrl: 'team-list.component.html',
    styleUrls: ['team-list.component.scss']
})
export class TeamListComponent implements OnInit {

    notifier = new Subject<void>();
    teams:any[] = [];

    constructor(private publicService: PublicService){

    }

    ngOnInit(): void {
        this.publicService.getTeams()
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            this.teams = data;
        });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}