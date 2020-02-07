import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {User} from '../../model/user';

@Injectable({
    providedIn: 'root'
})
/**
 * Service that manage users in local database
 */
export class UserService {

    /**
     * Get user from its id
     * @param id_user
     */
    get(id_user: number): Promise<User[]> {
        return DatabaseService.db.executeSql(
            'SELECT * FROM user WHERE id_user=?',
            [id_user]);
    }

    /**
     * Insert user
     * @param user
     */
    set(user: User): Promise<any> {
        return DatabaseService.db.executeSql(
            'insert into user (id_user, name, phone_number,' +
            ' country_code) values (?, ?, ?, ?)',
            [user.id_user, user.name, user.country_code,
                user.country_code]);
    }
}
