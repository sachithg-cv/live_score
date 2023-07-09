import { Component, Input, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-match-score',
  templateUrl: './match-score.component.html',
  styleUrls: ['./match-score.component.scss']
})
export class MatchScoreComponent implements OnInit {

    notifier = new Subject<void>();
    match:any;
    inning:any;
    roomId:any;
    status:any;
    inningType!:string;
    matchTitle!:string;
    runs: number[] = [0,1,2,3,4,5,6,7,8,9,10];
    illegalDeliveries: string[] = ["Wide", "No ball"];
    extras: string[] = ["Byes", "Leg Byes"];
    currentOverList: any;
    previousOverList:any;

    scoreSubmitForm = new FormGroup({
      batsman: new FormControl('',Validators.required),
      bowler: new FormControl('',Validators.required),
      runs: new FormControl('',Validators.required),
      illegalDelivery: new FormControl(''),
      extra: new FormControl(''),
      wicket: new FormControl(false),
    });

    constructor(private route: ActivatedRoute, private matchService: MatchService) {

    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const matchId = String(routeParams.get('matchId'));
        this.match = matchId;

        this.getInnings();
    }


    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

    joinRoom(): void {
        try {
            const socket = io("http://localhost:3000/match",{
              query:{
                roomId: this.roomId
              }
            });
      
            socket.on("connect", () => {
              console.log('is socket connected: ',socket.connected);
            });
      
            socket.on("disconnect", () => {
              console.log('is socket disconnected: ',socket.connected);
            });
      
            socket.on("connect_error", (err) => {
              console.log('socket connection error');
              console.log(err);
            });
      
            socket.on("live", (session) => {
              console.log('socket session created: ',session);
              
              if (session && session["currentOver"] && session["lastOvers"]) {
                const {currentOver, lastOvers } = session;
                this.mapOvers(currentOver, lastOvers);
              }
              
            });
        } catch (err) {
            console.error(err);
        } 
    }

    getInnings() :void{
      this.matchService.getInnings(this.match)
        .pipe(takeUntil(this.notifier))
        .subscribe((data:any)=>{
            this.status = data?.status
            if (this.status === "first_inning_started") {
                this.inning = data.firstInning;
                this.inningType = "First Innings";
            } else if (this.status === "second_inning_started") {
                this.inning = data.secondInning;
                this.inningType = "Second Innings"
            }
            this.matchTitle = `${this.inning?.batting.name} vs ${this.inning?.bowling.name}`;
            this.roomId = data?.roomId;
            this.mapOvers(this.inning.currentOver, this.inning.lastOvers);
            // const previousOver = this.inning.currentOver;
            // const currentOver = previousOver + 1;
            // this.currentOverList = this.inning.lastOvers.filter((over:any)=> over.over === currentOver);
            // this.previousOverList = this.inning.lastOvers.filter((over:any)=> over.over === previousOver);
            this.joinRoom();
        });
    }

    mapOvers(currentOverNumber:any, lastOvers:any[]): void {
      const previousOver = currentOverNumber;
      const currentOver = previousOver + 1;
      this.currentOverList = lastOvers.filter((over:any)=> over.over === currentOver);
      this.previousOverList = lastOvers.filter((over:any)=> over.over === previousOver);
    }

    loadDelivery(delivery:any) {
      console.log(delivery);
    }
}