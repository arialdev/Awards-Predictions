import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';
import {AwardEvent} from '../interfaces/award-event';

@Injectable({
  providedIn: 'root'
})
export class AwardEventService {

  private serverURL = `${environment.serverURI}/awardsEvents`;

  constructor(private http: HttpClient) {
  }

  getAwardEventByNameAndEdition(awardEventName: string, awardEdition: number): Observable<AwardEvent> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.get<AwardEvent>(`${this.serverURL}/${awardEventName}/${awardEdition}`, {headers});
  }

  getAwardEventById(id: string): Observable<AwardEvent> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<AwardEvent>(`${this.serverURL}/${id}`, {headers});
  }
}
