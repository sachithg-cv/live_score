import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { AuthModule } from './views/auth/auth.module';
import { SigninComponent } from './views/auth/signin/signin.component';
import {AuthGuard} from './views/auth/auth.guard';
import { SignoutComponent } from './views/auth/signout/signout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'public',
        loadChildren: () =>
          import('./views/public/public.module').then((m) => m.PublicModule)
      },
      {
        path: 'teams',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./views/teams/teams.module').then((m) => m.TeamsModule)
      },
      {
        path: 'matches',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./views/matches/matches.module').then((m) => m.MatchesModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: {
      title: 'Signin Page'
    }
  },
  {
    path: 'signout',
    component: SignoutComponent,
    data: {
      title: 'Signout Page'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      // initialNavigation: 'enabledBlocking'
       // relativeLinkResolution: 'legacy'
    }),
    AuthModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
