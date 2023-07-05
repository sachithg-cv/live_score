import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchCreateComponent } from './match-create/match-create.component';

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
          title: 'Match Create',
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
