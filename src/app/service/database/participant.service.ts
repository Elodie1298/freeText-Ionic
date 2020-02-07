import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor() { }

  /**
   * Get participant items from conversation's id
   * @param id_conversation
   */
  findFromConversation(id_conversation: number): Promise<any> {
    return DatabaseService.db.executeSql(
        'SELECT * FROM participant WHERE id_conversation=?',
        [id_conversation])
  }

  /**
   * Get participant items from user's id
   * @param id_user
   */
  findFromParticipant(id_user: number): Promise<any> {
    return DatabaseService.db.executeSql(
        'SELECT * FROM participant WHERE id_user=?',
        [id_user])
  }

  addParticipant(id_conversation: number, id_user: number, surname: string, fromServer:boolean = false): Promise<any> {
    return DatabaseService.db.executeSql(
        'SELECT * FROM participant WHERE id_conversation=? AND id_user=?',
        [id_conversation, id_user])
        .then(result => {
          if (result.length == 0) {
            return DatabaseService.db.executeSql(
                'INSERT INTO participant (id_conversation, id_user, surname, synchronized) VALUES (?, ?, ?, ?)',
                [id_conversation, id_user, surname, fromServer]);
          } else {
            let elem = result.rows.item(0);
            if (elem.surname != surname ||
                (fromServer && elem.synchronized != fromServer)) {
              return DatabaseService.db.executeSql(
                  'UPDATE participant SET surname=? AND synchornized=? WHERE id_conversation=? AND id_user=?',
                  [surname, fromServer, id_conversation, id_user]);
            } else {
              return new Promise(resolve => resolve(true));
            }
          }
        })
  }

  addMultipleParticipants(rows: {id_conversation: number, id_user: number, surname: string}[], fromServer: boolean = false) {
    if (rows.length > 0) {
      const participant = rows.pop();
      return this.addParticipant(participant.id_conversation, participant.id_user, participant.surname, fromServer)
          .then(_ => this.addMultipleParticipants(rows, fromServer));
    } else {
      return new Promise(resolve => resolve(true));
    }
  }
}
