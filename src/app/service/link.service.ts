import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Link } from '../models/link.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private apiUrl = `${environment.apiUrl}getTrendingLastHour`;

  constructor(private http: HttpClient) {}

  getTrendingLinks(): Observable<Link[]> {
    return this.http.get<Link[]>(this.apiUrl);
  }
}
