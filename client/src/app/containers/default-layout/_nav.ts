import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Teams',
    url: '/public/teams',
    iconComponent: { name: 'cil-people' },
  },
  {
    name: 'SignIn',
    url: '/signin',
    iconComponent: { name: 'cil-user' },
  },
];
