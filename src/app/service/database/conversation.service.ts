import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Conversation} from '../../model/conversation';
import {rowsToList, timestampToInteger} from '../../app.const';
import {isNullOrUndefined} from 'util';
import {ParticipantService} from './participant.service';
import {Participant} from '../../model/participant';
import {StorageService} from '../storage.service';
import {UserService} from './user.service';
import {User} from '../../model/user';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manage conversation on local database
 */
export class ConversationService {

  /**
   * List of conversations
   */
  static conversations: Conversation[];

  /**
   * Update conversation list
   */
  async updateList() {
    let statement = 'SELECT * FROM conversation';
    let result = await DatabaseService.db.executeSql(statement, []);
    ConversationService.conversations = await rowsToList(result.rows);
  }

  /**
   * Insert new conversation
   * TODO: handle title update
   * @param conversation
   */
  async set(conversation: Conversation): Promise<any> {
    let statement = 'SELECT * FROM conversation WHERE id_conversation = ?';
    let params: any[] = [conversation.id_conversation];
    let result = await DatabaseService.db.executeSql(statement, params);
    if (result.rows.length == 0) {
      statement = 'INSERT INTO conversation (id_conversation, title,' +
        ' timestamp) VALUES (?, ?, ?)';
      params = [conversation.id_conversation, conversation.title,
        timestampToInteger(conversation.timestamp)];
      await DatabaseService.db.executeSql(statement, params);
    }
  }

  /**
   * Get the title of a conversation
   * If no title is registered, it gets the names of the participants
   * except the logged user
   * @param conversationId
   */
  static getTitle(conversationId: number): string {
    let conversation = ConversationService.conversations
      .filter((conversationTemp: Conversation) =>
        conversationTemp.id_conversation == conversationId)[0];
    if (ParticipantService.participants
      && UserService.users
      && (isNullOrUndefined(conversation.title)
        || conversation.title == 'null')) {
      let participants = ParticipantService.participants
        .filter((participant: Participant) =>
          participant.id_conversation == conversationId);
      let title = '';
      participants.forEach((participant: Participant) => {
        if (participant.id_user != StorageService.userId) {
          let user = UserService.users
            .filter((user: User) => user.id_user == participant.id_user)[0];
          if (user) {
            title += `${user.name}, `;
          }
        }
      });
      return title.substr(0, title.length - 2);
    } else {
      return conversation.title;
    }
  }
}
