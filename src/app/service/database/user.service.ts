import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {User} from '../../model/user';
import {rowsToList} from '../../app.const';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manage users in local database
 */
export class UserService {

  /**
   * List of the users
   */
  static users: User[] = [];

  /**
   * Update user list
   */
  async updateList() {
    let statement = 'select * from user';
    let result = await DatabaseService.db.executeSql(statement, []);
    UserService.users = await rowsToList(result.rows);
  }

  /**
   * Get user from its id
   * @param id_user
   */
  async get(id_user: number): Promise<User[]> {
    let statement = 'SELECT * FROM user WHERE id_user=?';
    let params = [id_user];
    let result = await DatabaseService.db.executeSql(statement, params);
    return rowsToList(result.rows);
  }

  /**
   * Insert user
   * @param user
   */
  async set(user: User): Promise<any> {
    let statement = 'select * from user where id_user = ?';
    let params: any[] = [user.id_user];
    let result = await DatabaseService.db.executeSql(statement, params);
    if (result.rows.length == 0) {
      UserService.users.push(user);
      statement = 'insert into user (id_user, name, phone_number,' +
        ' country_code) values (?, ?, ?, ?)';
      params = [user.id_user, user.name, user.country_code, user.country_code];
      return await DatabaseService.db.executeSql(statement, params);
    }
  }

  /**
   * Return objects containing only the missing user's id
   */
  async getMissingUsers(): Promise<any[]> {
    let statement = 'select p.id_user from participant p left outer join ' +
      'user on user.id_user = p.id_user where user.id_user is null';
    let result = await DatabaseService.db.executeSql(statement, []);
    return rowsToList(result.rows);
  }
}
