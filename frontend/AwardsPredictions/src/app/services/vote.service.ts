import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './user.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private serverURL = `${environment.serverURI}/votes`;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  sendVotes(award, votes): Observable<object> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${(this.serverURL)}/${award}`, {userId: this.userService.user._id, votes}, {headers});
  }

}
