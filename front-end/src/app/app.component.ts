import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { PageViewComponent } from './components/page-view/page-view.component';
import { UserPublic, UserStatus } from './interfaces/user.interface';
import { ObservablesService } from './services/observables.service';
import { SocketService } from './services/socket.service';
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
  freezePage = true;
  loggedIn = false;
  viewingArticle = false;

  @Input() showPageDeletedModal = false;

  constructor(private router: Router, 
              private route: ActivatedRoute,
              private location: Location, 
              private userService: UserService, 
              private tokenService: TokenService,
              private socketService: SocketService,
              private observablesService: ObservablesService) {}

  ngOnInit(): void {
    this.observablesService.freezePage$.subscribe({
      next: (freezePage: boolean) => {
        this.freezePage = freezePage;
      },

      error: (err) => {
        console.log(err);
      }
    })

    this.socketService.userStatusUpdated.subscribe({
      next: (userStatus: UserStatus) => {
        console.log(userStatus);
        this.observablesService.userStatus$.next(userStatus);
      },

      error: (err) => {
        console.log(err);
      }
    })

    this.route.queryParamMap.subscribe(qparams => {
      const msgType = qparams.get('msg-type');
      if (qparams !== null) {
        switch (msgType) {
          case 'page-deleted':
            this.showPageDeletedModal = true;
            break;

          default:
            break;
        }
      }
    })
    
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
      }
    })
  }

  logOut() {
    if (this.currentUserInfo === null) {
      console.log('Error: currentUserInfo is null.')
      return;
    }

    this.socketService.logoutUser(this.currentUserInfo.username);
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

  onActivate(event: any) {
    if (event instanceof PageViewComponent) {
      this.viewingArticle = true;
    } else {
      this.viewingArticle = false;
    }
  }
}
