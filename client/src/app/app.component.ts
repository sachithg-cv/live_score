import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { io } from 'socket.io-client';
import { AuthService } from './views/auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'CoreUI Free Angular Admin Template';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((res)=>{
      console.log(res);
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    //TO:DO remove this
    try {
      const socket = io("http://localhost:3000/test");

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

      socket.on("greet", (session) => {
        console.log('socket session created: ',session);
      });

    } catch (err) {
      console.error(err);
    } 
  }
}
