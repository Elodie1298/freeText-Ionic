import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  find(id_user: number): Promise<any> {
    return DatabaseService.db.executeSql(
        'SELECT * FROM user WHERE id_user=?',
        [id_user]);
  }


}
