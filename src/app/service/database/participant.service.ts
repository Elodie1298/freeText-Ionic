import { Injectable } from '@angular/core';
import {Participant} from '../../model/participant';
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manage participants in local database
 */
export class ParticipantService {

  /**
   * Get all participant stored in the temporary database
   */
  getAllTemp(): Promise<Participant[]> {
    return DatabaseService.db.executeSql(
        'select * from participant_temp', []);
  }

  /**
   * Get participant for a given conversation
   * @param id_conversation
   */
  getForConversation(id_conversation: number): Promise<Participant[]> {
    return DatabaseService.db.executeSql(
        'select * from participant where id_conversation = ?',
        [id_conversation]);
  }

  /**
   * Get unsent participant for a given conversation
   * @param id_conversation
   */
  getForConversationTemp(id_conversation: number): Promise<Participant[]> {
    return DatabaseService.db.executeSql(
        'select * from participant_temp where id_conversation = ?',
        [id_conversation]);
  }

  /**
   * Insert participant into the appropriate table
   * @param participant
   * @param fromServer
   */
  set(participant: Participant, fromServer: boolean=false): Promise<any> {
    let table = 'participant';
    if (!fromServer) {
      table += '_temp';
    }
    return DatabaseService.db.executeSql(
        `insert into ${table} (id_conversation, id_user, nickname, 
                      timestamp) values (?, ?, ?, ?)`,
        [participant.id_conversation, participant.id_user,
        participant.nickname, participant.timestamp]);
  }

  /**
   * Delete participant from temporary table
   * @param participant
   */
  private deleteTemp(participant: Participant): Promise<any> {
    return DatabaseService.db.executeSql(
        'delete from participant_temp where id_conversation = ? and' +
        'id_user = ?',
        [participant.id_conversation, participant.id_user]);
  }

  /**
   * Save a participant that has been saved to the server
   * @param participant
   */
  save(participant: Participant): Promise<any> {
    return this.deleteTemp(participant)
        .then(_ => this.set(participant, true));
  }
}
