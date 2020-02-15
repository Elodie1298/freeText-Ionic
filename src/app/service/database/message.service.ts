import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Message} from '../../model/message';
import {rowsToList, timestampToInteger} from '../../app.const';
import {NotificationService} from '../notification.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manage participants in local database
 */
export class MessageService {

  /**
   * List of messages
   */
  static messages: Message[];

  /**
   * List of temporary messages
   */
  static messagesTemp: Message[];

  /**
   * Constructor of MessageService
   * @param notification
   */
  constructor(private notification: NotificationService) {
  }

  /**
   * Update conversation lists
   */
  async updateLists() {
    // Update messagesTemp
    let statement = 'select * from message_temp';
    let result = await DatabaseService.db.executeSql(statement, []);
    MessageService.messagesTemp = await rowsToList(result.rows);

    // Update Messages
    statement = 'select * from message';
    result = await DatabaseService.db.executeSql(statement, []);
    MessageService.messages = await rowsToList(result.rows);
  }

  /**
   * Get all messages stored in the temporary database
   */
  async getAllTemp(): Promise<Message[]> {
    let statement = 'select * from message_temp';
    let result = await DatabaseService.db.executeSql(statement, []);
    return await rowsToList(result.rows);
  }

  /**
   * Insert message into the appropriate database
   * @param message
   * @param fromServer
   * @param ignoreNotifications
   */
  async set(message: Message,
            fromServer: boolean = false,
            ignoreNotifications: boolean = false): Promise<any> {
    let statement: string;
    let params: any[];
    if (fromServer) {
      statement = 'insert into message (id_message, id_conversation,' +
        ' id_user, content, timestamp) values (?, ?, ?, ?, ?)';
      params = [message.id_message, message.id_conversation,
        message.id_user, message.content,
        timestampToInteger(message.timestamp)];
      let result = await DatabaseService.db.executeSql(
        'select * from message where id_message = ?',
        [message.id_message]);
      if (result.rows.length == 0) {
        if (!ignoreNotifications) {
          this.notification.addNotification(message);
        }
        await DatabaseService.db.executeSql(statement, params);
      }
    } else {
      statement = 'insert into message_temp (id_conversation,' +
        ' id_user, content, timestamp) values (?, ?, ?, ?)';
      params = [message.id_conversation, message.id_user,
        message.content, timestampToInteger(message.timestamp)];
      await DatabaseService.db.executeSql(statement, params);
    }
  }

  /**
   * Delete message from temporary table
   * @param message
   */
  private async deleteTemp(message: Message): Promise<any> {
    await DatabaseService.db.executeSql(
      'delete from message_temp where id_message = ?',
      [message.id_message]);
  }

  /**
   * Save a message that has been saved to the server
   * @param message
   * @param server_id
   * @param ignoreNotificatons
   */
  async save(message, server_id, ignoreNotificatons:boolean = false): Promise<any> {
    await this.deleteTemp(message);
    message.id_message = server_id;
    await this.set(message, true, ignoreNotificatons);
  }
}
