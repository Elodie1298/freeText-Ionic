import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {user} from "../app.const";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getUrl(): Promise<any> {
    return this.http.get(`${environment.api}/url`)
        .toPromise()
  }

  getAllConversations(): Promise<any> {
    return this.http.get(`${environment.api}/conversations?id_user=${user.id}`)
        .toPromise();
  }
}
