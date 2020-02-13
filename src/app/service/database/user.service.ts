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

    static users: User[] = [];

    /**
     * Update user list
     */
    updateList(): void {
        DatabaseService.db.executeSql('select * from user', [])
            .then(result => rowsToList(result.rows))
            .then((users: User[]) => UserService.users = users);
    }

    /**
     * Get user from its id
     * @param id_user
     */
    get(id_user: number): Promise<User[]> {
        return DatabaseService.db.executeSql(
            'SELECT * FROM user WHERE id_user=?',
            [id_user])
            .then(result => rowsToList(result.rows));
    }

    /**
     * Insert user
     * @param user
     */
    set(user: User): Promise<any> {
        return DatabaseService.db.executeSql(
            'select * from user where id_user = ?',
            [user.id_user])
            .then(result => {
                if (result.rows.length > 0) {
                    return new Promise(resolve => resolve(true));
                } else {
                    UserService.users.push(user);
                    return DatabaseService.db.executeSql(
                        'insert into user (id_user, name, phone_number,' +
                        ' country_code) values (?, ?, ?, ?)',
                        [user.id_user, user.name, user.country_code,
                            user.country_code]);
                }
            })
    }

    /**
     * Return objects containing only the missing user's id
     */
    getMissingUsers(): Promise<any[]> {
        return DatabaseService.db.executeSql(
            'select p.id_user from participant p left outer join ' +
            'user on user.id_user = p.id_user where user.id_user is null',
            [])
            .then(result => rowsToList(result.rows));
    }
}
