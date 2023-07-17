import { Component, OnInit } from '@angular/core';
import {DashboardService } from './dashboard.service';
import { Subject, map, takeUntil } from 'rxjs';
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  notifier = new Subject<void>();
  liveMatches:any[] = [];
  scheduledMatches:any[] = [];
  completedMatches:any[] = [];

  constructor(private dashboardService: DashboardService) {
  }


  ngOnInit(): void {
    this.dashboardService.getMatches()
    .pipe(
      takeUntil(this.notifier),
    )
    .subscribe((data)=>{
      this.loadMatches(data);
      console.log(data);
    });
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
  }

  loadMatches(data:any[]): void{
    if (data && data.length > 0) {
      //live
      this.liveMatches = data.filter((val:any) => val.isLive === true);
      // scheduled
      this.scheduledMatches = data.filter((val:any) => val.status === 'scheduled');
      //completed
      this.completedMatches = data.filter((val:any) => val.status === 'second_inning_ended');
    }
  }
}
