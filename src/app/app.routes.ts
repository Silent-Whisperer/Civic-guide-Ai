import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'explore',
    loadComponent: () => import('./explore/explore').then(m => m.Explore)
  }
];
