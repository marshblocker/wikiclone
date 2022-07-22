import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  identifier = 'username';

  userNotFound = false;
  userAlreadyLoggedIn = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qparams => {
      const msgType = qparams.get('msg-type');
      switch (msgType) {
        case 'user-not-found':
          this.userNotFound = true;
          break;

        case 'user-already-logged-in':
          this.userAlreadyLoggedIn = true;
          break
      
        default:
          break;
      }
    })
  }

}
