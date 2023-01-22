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
      })
    })
  }

}
