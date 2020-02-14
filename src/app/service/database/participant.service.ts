import {Injectable} from '@angular/core';
import {Participant} from '../../model/participant';
import {DatabaseService} from './database.service';
import {integerToTimestamp, rowsToList} from '../../app.const';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manage participants in local database
 */
export class ParticipantService {

  /**
   * List of participants
   */
  static participants: Participant[];
  /**
   * List of participants in the temporary table
   */
  static participantsTemp: Participant[];

  /**
   * Update static lists of data
   */
  async updateLists() {
    let statement = 'select * from participant_temp';
    let result = await DatabaseService.db.executeSql(statement, []);
    ParticipantService.participantsTemp = await rowsToList(result.rows);
    statement = 'select * from participant';
    result = await DatabaseService.db.executeSql(statement, []);
    ParticipantService.participants = await rowsToList(result.rows);
  }

  /**
   * Get all participant stored in the temporary database
   */
  async getAllTemp(): Promise<Participant[]> {
    let statement = 'select * from participant_temp';
    let result = await DatabaseService.db.executeSql(statement, []);
    return await rowsToList(result.rows);
  }

  /**
   * Insert participant into the appropriate table
   * @param participant
   * @param fromServer
   */
  async set(participant: Participant, fromServer: boolean = false): Promise<any> {
    let table = 'participant';
    if (!fromServer) {
      table += '_temp';
    }
    let statement = `insert into ${table} (id_conversation, id_user, nickname, 
                      timestamp) values (?, ?, ?, ?)`;
    let params = [participant.id_conversation, participant.id_user,
      participant.nickname, integerToTimestamp(participant.timestamp)];
    await DatabaseService.db.executeSql(statement, params);
  }

  /**
   * Delete participant from temporary table
   * @param participant
   */
  private async deleteTemp(participant: Participant): Promise<any> {
    let statement = 'delete from participant_temp where id_conversation = ?' +
      ' and id_user = ?';
    let params = [participant.id_conversation, participant.id_user];
    await DatabaseService.db.executeSql(statement, params);
  }

  /**
   * Save a participant that has been saved to the server
   * @param participant
   */
  async save(participant: Participant): Promise<any> {
    await this.deleteTemp(participant);
    await this.set(participant, true);
  }
}
