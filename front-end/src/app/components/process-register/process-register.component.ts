import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRequiredInfo } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-process-register',
  templateUrl: './process-register.component.html',
  styleUrls: ['./process-register.component.css']
})
export class ProcessRegisterComponent implements OnInit {
  successfulRegistration = false;

  constructor(private route: ActivatedRoute,
              private router: Router, 
              private userService: UserService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const username = queryParams.get('username');
      const password = queryParams.get('password');
      const email = queryParams.get('email');

      if (username === null || password === null || email === null) {
        console.log('Invalid user info.');
        return;
      }

      const info: UserRequiredInfo = {
        username: username,
        password: password,
        email: email
      };

      this.userService.registerNewUser(info)
        .then(newUser => {
          console.log(newUser);
          this.successfulRegistration = true;
        })
        .catch((err: HttpErrorResponse) => {
          if (err.status === 409) {
            const message = err.error.message as string; 
            let invalidAttribute: string;
            if (message.includes('username')) {
              invalidAttribute = 'username';
            } else if (message.includes('email')) {
              invalidAttribute = 'email';
            } else {
              console.log('invalidAttribute must be username or email.');
              return;
            }
            this.router.navigateByUrl('/user/register?msg-type=credentials-already-used&invalid-attr=' + invalidAttribute);
          }
        });
    });
  }

}
