import { Component, Input, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { PublicService } from '../public.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-live-inning',
    templateUrl: 'live-inning.component.html',
    styleUrls: ['live-inning.component.scss']
})
export class LiveInningComponent implements OnInit {

    notifier = new Subject<void>();
    @Input() inningId!: string;
    @Input() roomId!: string;
    @Input() inningType!: string;
    liveScore!: any;
    batting: any;
    bowling: any;
    batsmen: any;
    bowlers: any;
    currentOver: any = [];
    previousOver: any = [];
    currentOverNumber: any;
    previousOverNumber: any;
    room: any;

    constructor(private publicService: PublicService) {
    }


    ngOnInit(): void {
        this.publicService.getInning(this.inningId)
            .pipe(
                takeUntil(this.notifier),
            )
            .subscribe((data) => {
                console.log(data);
                const { liveScore, batting, bowling, batsmen, bowlers, currentOver, lastOvers } = data;
                this.batting = batting;
                this.bowling = bowling;

                this.liveScore = liveScore[0];
                this.batsmen = batsmen;
                this.bowlers = bowlers;
                this.mapOvers(currentOver, lastOvers);
                this.joinRoom();
            });
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }

    mapOvers(currentOver: number, lastOvers: any[]): void {
        this.previousOverNumber = currentOver;
        this.currentOverNumber = currentOver + 1;
        if (lastOvers && lastOvers.length > 0) {
            this.previousOver = lastOvers.filter((val) => val.over === this.previousOverNumber);
            this.currentOver = lastOvers.filter((val) => val.over === this.currentOverNumber);
        }
    }

    joinRoom(): void {
        try {
            if (this.room && this.room.connected) {
                console.log('already joined the room');
                return;
            }
            this.room = io(`${environment.messgingUrl}/match`, {
                query: {
                    roomId: this.roomId
                }
            });

            this.room.on("connect", () => {
                console.log('is socket connected: ', this.room.connected);
            });

            this.room.on("disconnect", () => {
                console.log('is socket disconnected: ', this.room.connected);
            });

            this.room.on("connect_error", (err: any) => {
                console.log('socket connection error');
                console.log(err);
            });

            this.room.on("live", (session: any) => {
                console.log('message recieved: ', session);

                if (session && session["type"] && session["type"] === "live_score") {
                    const { liveScore, batsmen, bowlers, currentOver, lastOvers } = session;
                    this.liveScore = liveScore[0];
                    this.batsmen = batsmen;
                    this.bowlers = bowlers;
                    this.mapOvers(currentOver, lastOvers);
                }

            });
        } catch (err) {
            console.error(err);
        }
    }
}