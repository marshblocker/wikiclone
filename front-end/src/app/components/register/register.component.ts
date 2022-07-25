import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() credentialsAlreadyUsed = false;
  invalidAttribute = '';

  constructor(private route: ActivatedRoute) { }

  // TODO: Validate registration info.
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qparams => {
      const msgType = qparams.get('msg-type');
      if (msgType === 'credentials-already-used') {
        const invalidAttribute = qparams.get('invalid-attr');
        if (invalidAttribute === null) {
          console.log('invalidAttribute is null.');
          return;
        }
        this.invalidAttribute = invalidAttribute;
        this.credentialsAlreadyUsed = true;
      }
    })

    const usernameEl = document.getElementById('username') as HTMLInputElement;
    const emailEl = document.getElementById('email') as HTMLInputElement;
    const passwordEl = document.getElementById('password') as HTMLInputElement;
    const repeatPasswordEl = document.getElementById('repeat-password') as HTMLInputElement;

    usernameEl.addEventListener('focus', (ev) => {
      usernameEl.classList.add('touched');
    });

    emailEl.addEventListener('focus', (ev) => {
      emailEl.classList.add('touched');
    });

    passwordEl.addEventListener('focus', (ev) => {
      passwordEl.classList.add('touched');
    });

    repeatPasswordEl.addEventListener('focus', (ev) => {
      repeatPasswordEl.classList.add('touched');
    });
  }

}
