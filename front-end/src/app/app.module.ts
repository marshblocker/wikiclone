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
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
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

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavBarComponent,
    SideBarComponent,
    NewPageEditorComponent,
    PageViewComponent,
    HomeComponent,
    PageNotFoundComponent,
    RandomPageComponent,
    RegisterComponent,
    LoginComponent,
    ExistingPageEditorComponent,
    ProcessRegisterComponent,
    ProcessLoginComponent,
    UserProfileComponent,
    TokenExpiredComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [PageService, UserService, TokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
