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
  }

}
