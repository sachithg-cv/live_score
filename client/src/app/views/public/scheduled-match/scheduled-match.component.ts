import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
    selector: "app-scheduled-match",
  templateUrl: 'scheduled-match.component.html',
  styleUrls: ['scheduled-match.component.scss']
})
export class ScheduledMatchComponent implements OnInit {

    
    constructor(private route: ActivatedRoute){
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));
        console.log(matchId);
    }

    ngOnInit(): void {
        
    }
}