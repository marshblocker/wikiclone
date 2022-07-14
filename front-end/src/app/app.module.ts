import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NewPageEditorComponent } from './components/new-page-editor/new-page-editor.component';
import { PageViewComponent } from './components/page-view/page-view.component';

import { PageService } from './services/page.service';
import { HomeComponent } from './components/home/home.component';
import { RandomPageComponent } from './components/random-page/random-page.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ExistingPageEditorComponent } from './components/existing-page-editor/existing-page-editor.component';
import { ProcessRegisterComponent } from './components/process-register/process-register.component';
import { UserService } from './services/user.service';
import { ProcessLoginComponent } from './components/process-login/process-login.component';
import { TokenService } from './services/token.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TokenExpiredComponent } from './components/token-expired/token-expired.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { PageEditService } from './services/page-edit.service';
import { PageVersionViewComponent } from './components/page-version-view/page-version-view.component';
import { PageVersionListComponent } from './components/page-version-list/page-version-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationEntryCardComponent } from './components/pagination-entry-card/pagination-entry-card.component';
import { ResourceNotFoundComponent } from './components/resource-not-found/resource-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavBarComponent,
    SideBarComponent,
    NewPageEditorComponent,
    PageViewComponent,
    HomeComponent,
    RandomPageComponent,
    RegisterComponent,
    LoginComponent,
    ExistingPageEditorComponent,
    ProcessRegisterComponent,
    ProcessLoginComponent,
    UserProfileComponent,
    TokenExpiredComponent,
    SearchResultComponent,
    PageVersionViewComponent,
    PageVersionListComponent,
    AdminDashboardComponent,
    PaginationComponent,
    PaginationEntryCardComponent,
    ResourceNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [PageService, UserService, TokenService, PageEditService],
  bootstrap: [AppComponent]
})
export class AppModule { }
