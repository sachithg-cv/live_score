import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'SignIn',
    url: '/signin',
    iconComponent: { name: 'cil-puzzle' },
  },
];
