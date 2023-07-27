import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-team-admin-List',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

    notifier = new Subject<void>();
    teams:any = [];

    constructor(private teamService: TeamService) {

    }

    ngOnInit(): void {
        this.teamService.getAll()
        .pipe(takeUntil(this.notifier))
        .subscribe((data)=>{
            console.log(data);
            this.teams = data;
        });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}