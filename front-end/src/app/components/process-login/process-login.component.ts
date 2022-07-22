import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCredentials, UserPublic } from 'src/app/interfaces/user.interface';
import { SocketService } from 'src/app/services/socket.service';
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
              private tokenService: TokenService,
              private socketService: SocketService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const username = queryParams.get('username');
      const email = queryParams.get('email');
      const password = queryParams.get('password');

      if ((username === null && email === null) || password === null) {
        console.log(username, email, password);
        console.log('Invalid user info.');
        return;
      }

      const credentials: LoginCredentials = {
        'username': username,
        'email': email,
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
                if (user['username'] === credentials['username'] ||
                      user['email'] === credentials['email']) {
                  break;
                }
              }
              if (user === null) {
                this.router.navigateByUrl('/user/login?msg-type=user-not-found');
                return;
              }

              this.socketService.loginUser(user.username);

              this.router.navigateByUrl('/');
            })
            .catch(console.log);
        })
        .catch((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.router.navigateByUrl('/user/login?msg-type=user-not-found');
          } else if (err.status === 409) {
            this.router.navigateByUrl('/user/login?msg-type=user-already-logged-in');
          } else {
            window.alert(`${err.error.message}\n\nYou will be redirected back to the main page.`);
            this.router.navigateByUrl('/');
          }
        });
    })
  }
}
