import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveMatchComponent } from './live-match/live-match.component';
import { CompletedMatchComponent } from './completed-match/completed-match.component';
import { TeamListComponent } from './team-list/team-list.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'live',
    },
    {
        path: 'live/:matchId',
        component: LiveMatchComponent,
        data: {
            title: 'Live',
        },
    },
    {
        path: 'completed/:matchId',
        component: CompletedMatchComponent,
        data: {
            title: 'Completed',
        },
    },
    {
        path: 'teams',
        component: TeamListComponent,
        data: {
            title: 'Teams',
        },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
