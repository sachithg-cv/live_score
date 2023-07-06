import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchCreateComponent } from './match-create/match-create.component';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchViewComponent } from './match-view/match-view.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Matches',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'create',
      },
      {
        path: 'create',
        component: MatchCreateComponent,
        data: {
          title: 'Create',
        },
      },
      {
        path: 'list',
        component: MatchListComponent,
        data: {
          title: 'List',
        },
      },
      {
        path: 'view/:matchId',
        component: MatchViewComponent,
        data: {
          title: 'View',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesRoutingModule {}
