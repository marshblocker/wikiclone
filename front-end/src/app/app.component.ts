import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { UserPublic } from './interfaces/user.interface';
import { PageService } from './services/page.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end';
  pageType = 'Article'; // This is passed to the navBar.
  currentRoute!: string;
  currentUserInfo: UserPublic | null = null;
  freezePage!: boolean;
  loggedIn = false;
  viewingArticle = false;

  constructor(private router: Router, 
              private location: Location, 
              private userService: UserService, 
              private tokenService: TokenService,
              private pageService: PageService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      // From https://stackoverflow.com/a/46305085/17927002
      if (event instanceof RoutesRecognized) {
        let routeCustomData = event.state.root.firstChild?.data;
        if (routeCustomData === undefined) {
          console.log('Error: Undefined custom data!');
          return;
        }
        this.pageType = routeCustomData['pageType'];
      }

      if (event instanceof NavigationEnd) {
        if (this.location.path() != ''){
          this.currentRoute = this.location.path();
        } else {
          this.currentRoute = '/';
        }

        if (this.tokenService.tokenInCookie() && !this.loggedIn) {
          this.logIn();
        }
        if (this.currentRoute === '?logout=true') {
          this.logOut();
          this.router.navigateByUrl('/');
        }
        if (this.currentRoute === '/token_expired') {
          this.currentUserInfo = null;
          this.loggedIn = false;
        }
        this.viewingArticle = this.isViewingArticle();
        if (this.viewingArticle) {
          const pageTitle = this.currentRoute.split('/wiki/')[1];
          this.pageService.getPageByTitle(pageTitle)
            .then(page => {
              this.freezePage = page.freeze_page;
            })
            .catch(console.log);
        }
      }
    })
  }

  logOut() {
    this.currentUserInfo = null;
    this.loggedIn = false;
    this.tokenService.deleteTokenInCookie();
  }

  logIn() {
    this.userService.readCurrentUser()
      .then((currentUserInfo: UserPublic) => {
        this.currentUserInfo = currentUserInfo;
        this.loggedIn = true;
      })
      .catch(console.log);
  }

  isViewingArticle(): boolean {
    return this.currentRoute.startsWith('/wiki/') &&
           !(this.currentRoute.split('/wiki/')[1].includes('/')) &&
           !(this.currentRoute.split('/wiki/')[1].startsWith('search?'));
  }
}
