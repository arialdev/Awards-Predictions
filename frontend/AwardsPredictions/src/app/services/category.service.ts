import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';
import {Category} from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // private serverURL = `${environment.serverURI}/categories`;

  constructor() {
  }
}
