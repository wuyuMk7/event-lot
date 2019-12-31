import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'site',
    loadChildren: () => import('./site/site.module').then(m => m.SiteModule)
  },
  {
    path: 'i',
    loadChildren: () => import('./individual/individual.module').then(m => m.IndividualModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
