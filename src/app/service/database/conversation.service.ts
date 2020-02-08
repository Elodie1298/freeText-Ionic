import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Conversation} from '../../model/conversation';
import {rowsToList, timestampToInteger} from '../../app.const';

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
}
