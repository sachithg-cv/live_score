import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';
@Component({
  templateUrl: 'live-match.component.html',
  styleUrls: ['live-match.component.scss']
})
export class LiveMatchComponent implements OnInit {

    
    constructor(private route: ActivatedRoute){
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));
        console.log(matchId);
    }

    ngOnInit(): void {
        
    }
}