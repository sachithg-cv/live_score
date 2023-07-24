import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveMatchComponent } from './live-match/live-match.component';
import { CompletedMatchComponent } from './completed-match/completed-match.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
