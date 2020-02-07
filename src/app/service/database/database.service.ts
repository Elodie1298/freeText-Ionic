import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {HttpClient} from "@angular/common/http";
import {SQLitePorter} from "@ionic-native/sqlite-porter/ngx";

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
                private http: HttpClient) { }

    /**
     * Initialisation of the database
     */
    init(): Promise<any> {
        return this.sqLite.create({
            name: 'freetext.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                DatabaseService.db = db;
                return this.initTables();
            });
    }

    /**
     * Initialisation of the tables based on the file assets/init.sql
     */
    private initTables(): Promise<any> {
        return new Promise<any>(resolve => {
            this.http.get('assets/init.sql', {responseType: 'text'})
                .subscribe(sql => {
                    this.sqLitePorter.importSqlToDb(DatabaseService.db, sql)
                        .then(_ => {
                            console.log('imported');
                            resolve(true);
                        })
                })
        })
    }
}
