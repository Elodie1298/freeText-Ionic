import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  addMessage(id_conversation: number, title: string) {
    return DatabaseService.db.executeSql(`SELECT * FROM conversation WHERE id_conversation=${id_conversation}`, [])
        .then(res => {
          if (res.rows.length == 0) {
            return DatabaseService.db.executeSql(
                'INSERT INTO conversation (id_conversation, title) VALUES (?, ?)',
                [id_conversation, title]);
          } else {
            return new Promise(resolve => resolve(true));
          }
        })
  }

  addMultipleMessage(rows: {id_message:number, title: string}[]): Promise<any> {
    if (rows.length > 0) {
      const conversation = rows.pop();
      return this.addMessage(conversation.id_message, conversation.title)
          .then(_ => this.addMultipleMessage(rows))
    } else {
      console.log('Conversation importation over');
      return new Promise<any>(resolve => resolve(true));
    }
  }
}
