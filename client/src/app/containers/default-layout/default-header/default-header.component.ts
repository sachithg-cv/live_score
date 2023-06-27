import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/views/auth/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit{

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);
  signedIn$: any;
  currentUser$: any;

  constructor(private classToggler: ClassToggleService, private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.signedIn$ = this.authService.signedin$;
    this.currentUser$ = this.authService.currentUser$;
  }
  
}
