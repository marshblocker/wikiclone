import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserStatus } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {
  userStatus$ = new Subject<UserStatus>();
  pageEditor$ = new Subject<string[]>();
  freezePage$ = new Subject<boolean>();

  constructor() { }
}
