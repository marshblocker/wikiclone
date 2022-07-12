import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ExistingPageEditorComponent } from './components/existing-page-editor/existing-page-editor.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewPageEditorComponent } from './components/new-page-editor/new-page-editor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageViewComponent } from './components/page-view/page-view.component';
import { ProcessLoginComponent } from './components/process-login/process-login.component';
import { ProcessRegisterComponent } from './components/process-register/process-register.component';
import { RandomPageComponent } from './components/random-page/random-page.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { TokenExpiredComponent } from './components/token-expired/token-expired.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'WikiClone',
    data: { pageType: 'Main Page' },
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    title: '404 Page Not Found',
    data: { pageType: 'Page Not Found' },
  },
  {
    path: 'token_expired',
    component: TokenExpiredComponent,
    title: 'Session Token Expired',
    data: { pageType: '' }
  },
  {
    path: 'wiki/:page_id/edit',
    component: ExistingPageEditorComponent,
    title: 'Edit Article',
    data: { pageType: 'Edit Article' },
  },
  {
    path: 'wiki/new',
    component: NewPageEditorComponent,
    title: 'New Wiki Article',
    data: { pageType: 'New Article' },
  },
  {
    path: 'wiki/random',
    component: RandomPageComponent,
  },
  {
    path: 'wiki/search',
    component: SearchResultComponent,
    title: 'Search Result',
    data: { pageType: 'Search' }
  },
  {
    path: 'wiki/:page_id',
    component: PageViewComponent,
    title: 'WikiClone Article',
    data: { pageType: 'Article' },
  },
  {
    path: 'user/register/process',
    component: ProcessRegisterComponent,
    title: 'Process Register'
  },
  {
  {
    path: 'user/:username/admin',
    component: AdminDashboardComponent,
    title: 'Admin Dashboard',
    data: { pageType: 'Admin Dashboard' }
  },
    path: 'user/register',
    component: RegisterComponent,
    title: 'Registration',
    data: { pageType: 'Registration' }
  },
  {
    path: 'user/login/process',
    component: ProcessLoginComponent,
    title: 'Process Login'
  },
  {
    path: 'user/login',
    component: LoginComponent,
    title: 'Sign In',
    data: { pageType: 'Sign In' }
  },
  {
    path: 'user/:username/profile',
    component: UserProfileComponent,
    title: 'User Profile',
    data: { pageType: 'User Profile' }
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
