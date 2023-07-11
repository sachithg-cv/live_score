import { Component, Input, OnInit } from '@angular/core';
import { MatchService} from '../match.service';
import { Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
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
    illegalDeliveries: string[] = ["None","Wide", "No ball"];
    extrasType: string[] = ["None","Byes", "Leg Byes"];
    currentOverList: any;
    previousOverList:any;
    settings:any = { "Wide":5, "No ball": 4};
    room:any;
    editDeliveryModalVisible: boolean = false;
    editingDelivery:any = null;
    isEditingMode: boolean = false;
    currentBowler:string = '';

    scoreSubmitForm = new FormGroup({
      batsman: new FormControl('',Validators.required),
      bowler: new FormControl('',Validators.required),
      runs: new FormControl(0,Validators.required),
      illegalDelivery: new FormControl('None'),
      extraType: new FormControl('None'),
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
        if (this.room && this.room.connected) {
          this.room.disconnect();
        }
    }

    joinRoom(): void {
        try {
          if (this.room && this.room.connected) {
            console.log('already joined the room');
            return;
          }
            this.room = io(`${environment.messgingUrl}/match`,{
              query:{
                roomId: this.roomId
              }
            });
      
            this.room.on("connect", () => {
              console.log('is socket connected: ',this.room.connected);
            });
      
            this.room.on("disconnect", () => {
              console.log('is socket disconnected: ',this.room.connected);
            });
      
            this.room.on("connect_error", (err:any) => {
              console.log('socket connection error');
              console.log(err);
            });
      
            this.room.on("live", (session: any) => {
              console.log('message recieved: ',session);

              if (session && session["type"] && session["type"]==="live_score") {
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
            this.joinRoom();
        });
    }

    mapOvers(currentOverNumber:any, lastOvers:any[]): void {
      const previousOver = currentOverNumber;
      const currentOver = previousOver + 1;
      this.currentOverList = lastOvers.filter((over:any)=> over.over === currentOver);
      this.previousOverList = lastOvers.filter((over:any)=> over.over === previousOver);

      if(this.currentOverList && this.currentOverList.length > 0) {
        this.currentBowler = this.currentOverList[0]?.bowlerId;
        this.scoreSubmitForm.get("bowler")?.setValue(this.currentBowler as string);
      }
    }

    loadDelivery(delivery:any) {
      console.log(delivery);
      this.editingDelivery = delivery;
      this.editDeliveryModalVisible = true;
    }

    submitForm(): void {
      if (this.scoreSubmitForm.invalid) {
        return;
      }

      if (this.isEditingMode) {
        this.submitEditedDelivery();
      } else {
        this.submitDelivery();
      }
    }

    submitDelivery(): void {

      const {batsman,bowler,runs,illegalDelivery,extraType,wicket} = this.scoreSubmitForm.value;

      const currentOver = this.inning.currentOver + 1;
      const batsmanDetails = this.inning.batting.players.find((data:any)=> data._id === batsman);
      const bowlerDetails = this.inning.bowling.players.find((data:any)=> data._id === bowler);

      const delivery: any = {
        over: currentOver,
        batsmanId:batsmanDetails._id,
        batsmanName: `${batsmanDetails.firstName} ${batsmanDetails.lastName}`,
        bowlerId: bowlerDetails._id,
        bowlerName: `${bowlerDetails.firstName} ${bowlerDetails.lastName}`,
        runs:0,
        isLegal: true,
        illegalType: "None",
        isWicket: wicket,
        extraRuns:0,
        extraType:"None",
      }

      if (illegalDelivery && (illegalDelivery === "Wide" || illegalDelivery ==="No ball")){
        delivery.isLegal = false;
        delivery.extraRuns += this.settings[illegalDelivery]
        delivery.illegalType = illegalDelivery;
      }

      if (extraType && (extraType==="Byes" || extraType==="Leg Byes")) {
        delivery.extraRuns += runs;
        delivery.extraType = extraType;
      } else {
        delivery.runs = runs;
      }

      const req = {
        roomId:this.roomId,
        delivery
      }
      console.log(req);

      this.matchService.submitDelivery(this.inning.id,req)
      .pipe(takeUntil(this.notifier))
      .subscribe((_)=>{
        this.currentBowler = bowler as string;
        this.scoreSubmitForm.reset(
          {
            batsman:'',
            bowler: this.currentBowler,
            runs: 0,
            extraType: 'None',
            illegalDelivery: 'None',
            wicket: false
          }    
        );
      });
    }

    syncData(): void {
      this.getInnings();
    }

    endOver(): void {
      this.matchService.endOver(this.inning.id)
      .pipe(takeUntil(this.notifier))
      .subscribe((data)=>{
        console.log(data);
        this.currentBowler = '';
        this.scoreSubmitForm.reset(
          {
            batsman:'',
            bowler: this.currentBowler,
            runs: 0,
            extraType: 'None',
            illegalDelivery: 'None',
            wicket: false
          }    
        );
        this.getInnings();

      });
    }

    removeDelivery(): void {
      const req = {
        roomId: this.roomId
      };

      this.matchService.removeDelivery(this.inning.id,this.editingDelivery._id,req)
      .pipe(takeUntil(this.notifier))
      .subscribe((data:any)=>{
        console.log(data);
        this.editingDelivery = null;
        this.scoreSubmitForm.reset(
          {
            batsman:'',
            bowler: this.currentBowler,
            runs: 0,
            extraType: 'None',
            illegalDelivery: 'None',
            wicket: false
          }    
        );
        this.closeEditDeliveryDialog();
      });
    }

    loadEditDelivery(): void {
      this.isEditingMode = true;
      const {batsmanId, bowlerId, extraType, illegalType, runs, isWicket} = this.editingDelivery;

      this.scoreSubmitForm.setValue({
        batsman: batsmanId,
        bowler: bowlerId,
        extraType: extraType,
        illegalDelivery: illegalType,
        runs: runs,
        wicket: isWicket
      });
      this.closeEditDeliveryDialog();
    }

    submitEditedDelivery(): void {
      const {batsman,bowler,runs,illegalDelivery,extraType,wicket} = this.scoreSubmitForm.value;

      const batsmanDetails = this.inning.batting.players.find((data:any)=> data._id === batsman);
      const bowlerDetails = this.inning.bowling.players.find((data:any)=> data._id === bowler);

      const delivery: any = {
        batsmanId:batsmanDetails._id,
        batsmanName: `${batsmanDetails.firstName} ${batsmanDetails.lastName}`,
        bowlerId: bowlerDetails._id,
        bowlerName: `${bowlerDetails.firstName} ${bowlerDetails.lastName}`,
        runs:0,
        isLegal: true,
        illegalType: "None",
        isWicket: wicket,
        extraRuns:0,
        extraType:"None",
      }

      if (illegalDelivery && (illegalDelivery === "Wide" || illegalDelivery ==="No ball")){
        delivery.isLegal = false;
        delivery.extraRuns += this.settings[illegalDelivery]
        delivery.illegalType = illegalDelivery;
      }

      if (extraType && (extraType==="Byes" || extraType==="Leg Byes")) {
        delivery.extraRuns += runs;
        delivery.extraType = extraType;
      } else {
        delivery.runs = runs;
      }

      const req = {
        roomId: this.roomId,
        delivery
      }
      console.log(req);

      this.matchService.editDelivery(this.inning.id,this.editingDelivery._id,req)
      .pipe(takeUntil(this.notifier))
      .subscribe((_)=>{
        this.isEditingMode = false;
        this.editingDelivery = null;
        this.scoreSubmitForm.reset(
          {
            batsman:'',
            bowler: this.currentBowler,
            runs: 0,
            extraType: 'None',
            illegalDelivery: 'None',
            wicket: false
          }    
        );
      });
    }

    cancelEditDelivery() {
      this.isEditingMode = false;
      this.editingDelivery = null;
      this.scoreSubmitForm.reset(
        {
          batsman:'',
          bowler: this.currentBowler,
          runs: 0,
          extraType: 'None',
          illegalDelivery: 'None',
          wicket: false
        }    
      );
    }

    closeEditDeliveryDialog():void {
      this.editDeliveryModalVisible = false;
    }
}
