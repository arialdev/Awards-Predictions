import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NomineeService {

  private serverURL = `${environment.serverURI}/nominee`;

  constructor(private http: HttpClient) {
  }

  public getNomineePicture(id: string): Observable<Blob> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*');

    return this.http.get<Blob>(`${(this.serverURL)}/${id}`, {
      responseType: 'blob' as 'json',
      headers
    });
  }
}
