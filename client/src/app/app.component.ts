import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { AuthService } from './views/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { AppService } from './app.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'Live Score';

  notifier = new Subject<void>();
  room: any;
  roomId: any;

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService,
    private appService: AppService,
    private messageService: MessageService
  ) {
    titleService.setTitle(this.title);
    // // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.notifier),)
      .subscribe((res) => {
        console.log(res);
      });

    this.appService.getGlobalsPublic()
      .pipe(takeUntil(this.notifier))
      .subscribe((data) => {
        console.log(data);
        const { roomId } = data[0];
        this.roomId = roomId;
        this.joinRoom();
      });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  joinRoom(): void {
    try {
      if (this.room && this.room.connected) {
        console.log('already joined the room');
        return;
      }

      this.room = io(`${environment.messgingUrl}/global`, {
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

      this.room.on("dashboard", (session: any) => {
        console.log('message recieved: ', session);
        if (session && session.length > 0) {
          this.appService.matches$.next(session);
        }

      });

      this.room.on("info", (session: any) => {
        console.log('message recieved: ', session);
        if (session) {
          const { message } = session;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
        }
        
      });

    } catch (err) {
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
    if (this.room && this.room.connected) {
      this.room.disconnect();
    }
  }

}
