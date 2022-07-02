import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArticleBodyComponent } from './components/article-body/article-body.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NewPageComponent } from './components/new-page/new-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleBodyComponent,
    FooterComponent,
    NavBarComponent,
    SideBarComponent,
    NewPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
