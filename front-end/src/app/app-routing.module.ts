import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewPageEditorComponent } from './components/new-page-editor/new-page-editor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageViewComponent } from './components/page-view/page-view.component';
import { RandomPageComponent } from './components/random-page/random-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'WikiClone',
    data: { pageType: 'Home' },
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    title: '404 Page Not Found',
    data: { pageType: '404' },
  },
  {
    path: 'wiki/new',
    component: NewPageEditorComponent,
    title: 'New Wiki Article',
    data: { pageType: 'New Article' },
  },
  { path: 'wiki/random', component: RandomPageComponent },
  {
    path: 'wiki/:page_id',
    component: PageViewComponent,
    title: 'WikiClone Article',
    data: { pageType: 'Article' }
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
