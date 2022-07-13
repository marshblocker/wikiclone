import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // maxAge is in hours format.
  storeTokenInCookie = (token: string, maxAge: number) => {
    document.cookie = 'token=' + token + '; path=/; max-age=' + maxAge * 3600;
  }

  deleteTokenInCookie = () => {
    if (this.tokenInCookie()) {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }

  tokenInCookie = (): boolean => {
    return document.cookie.split(';').some(c => {
      return c.trim().startsWith('token=');
    });
  }
}
