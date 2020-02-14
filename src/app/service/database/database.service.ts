import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {HttpClient} from '@angular/common/http';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that initiate the database
 */
export class DatabaseService {

  /**
   * Database object
   */
  static db: SQLiteObject;

  /**
   * Constructor of DatabaseService
   * @param sqLite
   * @param sqLitePorter
   * @param http
   */
  constructor(private sqLite: SQLite,
              private sqLitePorter: SQLitePorter,
              private http: HttpClient) {
  }

  /**
   * Initialisation of the database
   */
  async init(): Promise<any> {
    DatabaseService.db = await this.sqLite.create({
      name: 'freetext.db',
      location: 'default'
    });
    await this.initTables();
  }

  /**
   * Initialisation of the tables based on the file assets/init.sql
   */
  private async initTables(): Promise<any> {
    let sql = await this.http.get('assets/init.sql', {responseType: 'text'}).toPromise();
    await this.sqLitePorter.importSqlToDb(DatabaseService.db, sql);
  }
}
