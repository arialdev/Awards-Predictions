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
  private _votes;
  private votesPicture = null;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  get votes(): object[] {
    return this._votes;
  }

  set votes(value: object[]) {
    this._votes = value;
  }

  sendVotes(award, votes): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${(this.serverURL)}/${award}`, {userId: this.userService.user._id, votes}, {headers});
  }

  public createImage(data): Observable<Blob> {
    console.log(data);
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post<Blob>(`${(this.serverURL)}/image/${this.userService.user._id}`, {data}, {
      responseType: 'blob' as 'json',
      headers
    });
  }

}
