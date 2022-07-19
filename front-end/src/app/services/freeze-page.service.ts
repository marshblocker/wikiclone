import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FreezePageService {
  freezePage$ = new Subject<boolean>();

  constructor() { }
}
