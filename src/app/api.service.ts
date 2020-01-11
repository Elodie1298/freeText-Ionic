import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'http://192.168.0.120:3000/url';

  constructor(private http: HttpClient) { }

  getUrl(): Promise<any> {
    return this.http.get(this.url).toPromise()
  }
}
