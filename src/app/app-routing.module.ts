import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'conversation/:id',
    loadChildren: () => import('./components/conversation/conversation.module').then(m => m.ConversationPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./components/start/start.module').then(m => m.StartPageModule)
  },
  {
    path: 'new-conversation',
    loadChildren: () => import('./components/home/new-conversation/new-conversation.module').then(m => m.NewConversationPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
