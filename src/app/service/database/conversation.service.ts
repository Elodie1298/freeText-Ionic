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

  static conversations: Conversation[];

  /**
   * Update conversation list
   */
  updateList(): void {
    DatabaseService.db.executeSql(
      'SELECT * FROM conversation', [])
      .then(result => rowsToList(result.rows))
      .then((conversations: Conversation[]) =>
        ConversationService.conversations = conversations);
  }

  /**
   * Insert new conversation
   * @param conversation
   */
  set(conversation: Conversation): Promise<any> {
    return DatabaseService.db.executeSql(
      'SELECT * FROM conversation WHERE id_conversation = ?',
      [conversation.id_conversation])
      .then(res => {
        if (res.rows.length == 0) {
          return DatabaseService.db.executeSql(
            'INSERT INTO conversation (id_conversation, title,' +
            ' timestamp) VALUES (?, ?, ?)',
            [conversation.id_conversation, conversation.title,
              timestampToInteger(conversation.timestamp)]);

        } else {
          // TODO: handle title update
          return new Promise(resolve => resolve(true));
        }
      });
  }

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
