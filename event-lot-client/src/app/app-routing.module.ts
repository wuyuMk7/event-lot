import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEventComponent } from './_shared/events/add-event/add-event.component';

const routes: Routes = [
  {
    path: 'site',
    loadChildren: () => import('./site/site.module').then(m => m.SiteModule)
  },
  {
    path: 'i',
    loadChildren: () => import('./individual/individual.module').then(m => m.IndividualModule)
  },
  { path: 'events/add', component: AddEventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
