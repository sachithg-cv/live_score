import { Component, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { AuthService } from 'src/app/views/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit{

  public navItems = navItems;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.signedin$.subscribe((isSignedIn)=>{
      if (isSignedIn) {
        this.navItems.splice(1, 0, {
          title: true, name: 'Teams'
        },{
          name: 'Create', url: '/teams/create', iconComponent: {name:'cil-puzzle'}
        });
      }
    });
    
  }
}
