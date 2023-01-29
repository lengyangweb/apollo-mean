import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN } from '../mutations/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _apollo: Apollo) { }

  login(loginObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._apollo.mutate({
        mutation: LOGIN,
        variables: loginObj
      })
      .subscribe((res: any) => {
        resolve(res);
      }, (error) => console.error(error));
    });
  }

  setToken(token: string): void {
    localStorage.setItem('access-token', JSON.stringify(token));
  }

  setTokenExpired(expireTime: string): void {
    localStorage.setItem('token-expiredIn', JSON.stringify(expireTime));
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh-token', JSON.stringify(refreshToken));
  }

  logout(): void {

  }

}
