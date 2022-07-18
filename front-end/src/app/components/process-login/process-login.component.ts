import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCredentials, UserPublic } from 'src/app/interfaces/user.interface';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-process-login',
  templateUrl: './process-login.component.html',
  styleUrls: ['./process-login.component.css']
})
export class ProcessLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private userService: UserService,
              private tokenService: TokenService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const usernameOrEmail = queryParams.get('username-or-email');
      const password = queryParams.get('password');

      if (usernameOrEmail === null || password === null) {
        console.log(usernameOrEmail, password);
        console.log('Invalid user info.');
        return;
      }

      const credentials: LoginCredentials = {
        'usernameOrEmail': usernameOrEmail,
        'password': password
      };

      this.userService.loginUser(credentials)
        .then(token => {
          this.tokenService.storeTokenInCookie(token, 4);
          this.userService.readAllUsers(0, 10000000)
            .then(allUsersInfo => {
              let user: UserPublic | null = null;
              for (let i = 0; i < allUsersInfo.length; i++) {
                user = allUsersInfo[i];
                if (user['username'] === credentials['usernameOrEmail'] ||
                      user['email'] === credentials['usernameOrEmail']) {
                  break;
                }
              }
              if (user === null) {
                console.log('User not found!');
                return;
              }
              this.router.navigateByUrl('/');
            })
            .catch(console.log);
        })
        .catch((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.router.navigateByUrl('/404?resource=user');
          } else {
            window.alert(`${err.error.message}\n\nYou will be redirected back to the main page.`);
            this.router.navigateByUrl('/');
          }
        });
    })
  }
}
