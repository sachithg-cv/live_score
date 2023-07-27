import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamCreateComponent } from './team-create/team-create.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamEditComponent } from './team-edit/team-edit.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Teams',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'create',
        component: TeamCreateComponent,
        data: {
          title: 'Team Create',
        },
      },
      {
        path: 'list',
        component: TeamListComponent,
        data: {
          title: 'Team List',
        },
      },
      {
        path: 'edit/:teamId',
        component: TeamEditComponent,
        data: {
          title: 'Team Edit',
        },
      },
      
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
