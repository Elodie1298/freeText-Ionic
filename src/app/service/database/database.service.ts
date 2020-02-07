import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {HttpClient} from "@angular/common/http";
import {SQLitePorter} from "@ionic-native/sqlite-porter/ngx";
import {ApiService} from "../api.service";
import {ConversationService} from "./conversation.service";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

    static db: SQLiteObject;

    constructor(private sqLite: SQLite,
                private sqLitePorter: SQLitePorter,
                private http: HttpClient,
                private api: ApiService,
                private conversationService: ConversationService) { }

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

    seedTables(): Promise<any> {
        return this.api.getAllConversations()
            .then(result => this.conversationService.addMultipleConversations(result, true))
    }
}
