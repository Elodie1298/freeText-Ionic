import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor() { }

  findAll() {
    return DatabaseService.db.executeSql(
        'SELECT * FROM conversation', []
    )
  }

  addConversation(id_conversation: number, title: string, fromServer: boolean =false) {
    return DatabaseService.db.executeSql(`SELECT * FROM conversation WHERE id_conversation=?`, [id_conversation])
        .then(res => {
          if (res.rows.length == 0) {
            return DatabaseService.db.executeSql(
                'INSERT INTO conversation (id_conversation, title, synchronized) VALUES (?, ?, ?)',
                [id_conversation, title, fromServer]);
          } else {
            let elem = res.rows.item(0);
            if (elem.title != title ||
                (fromServer && elem.synchronized != fromServer)) {
              return DatabaseService.db.executeSql(
                  `UPDATE conversation SET title=? AND synchronized=? WHERE id_conversation=?`,
                  [title, fromServer, id_conversation]
                  )
            } else {
              return new Promise(resolve => resolve(true));
            }
          }
        })
  }

  addMultipleConversations(rows: { id_conversation: number, title: string }[], fromServer: boolean =false): Promise<any> {
    if (rows.length > 0) {
      const conversation = rows.pop();
      return this.addConversation(conversation.id_conversation, conversation.title, fromServer)
          .then(_ => this.addMultipleConversations(rows, fromServer))
    } else {
      return new Promise(resolve => resolve(true));
    }
  }
}
