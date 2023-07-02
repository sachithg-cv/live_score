import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamCreateComponent } from './team-create/team-create.component';

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
        redirectTo: 'create',
      },
      {
        path: 'create',
        component: TeamCreateComponent,
        data: {
          title: 'Team Create',
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
