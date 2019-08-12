import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import * as SHA1 from 'js-sha1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string;

  constructor(private client: HttpClient) {
    this.url = 'http://mybudget.website:3000/';
  }

  getLoginInfo(): Observable<any> {
    return  this.client.get(this.url + 'logininfo');
  }

  login(userInfo: User, callback) {
    // TODO: check user info ....
    let correctUser: User;

    this.getLoginInfo().subscribe( data => {
      console.log(data);
      correctUser = { password: data.password, username: data.username};
      let response = false;

      if ( SHA1(userInfo.password) === correctUser.password && userInfo.username === correctUser.username) {
        console.log('loged in');
        localStorage.setItem('MYBUDGET_TOKEN', new Date().getTime().toString());
        response = true;
      } else {
        console.log('cannot logged in');
        response = false;
      }
      callback(response);
    });
  }

  logout() {
    localStorage.removeItem('MYBUDGET_TOKEN');
  }

  isLoggedIn() {
    return localStorage.getItem('MYBUDGET_TOKEN') !== null;
  }
}
