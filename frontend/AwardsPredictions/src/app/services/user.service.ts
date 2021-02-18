import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverURL = `${environment.serverURI}/users`;
  // tslint:disable-next-line:variable-name
  private _user: User = null;

  constructor(private http: HttpClient) {
  }

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  registerUser(username: string): Observable<User> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    const body = new URLSearchParams();
    body.set('name', username);
    return this.http.post<User>(`${(this.serverURL)}`, {name: username}, {headers});
  }
}
