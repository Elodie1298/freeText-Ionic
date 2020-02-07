import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Conversation} from '../../model/conversation';

@Injectable({
    providedIn: 'root'
})
/**
 * Service that manage conversation on local database
 */
export class ConversationService {

    /**
     * Recover all conversations stored
     */
    getAll(): Promise<Conversation[]> {
        return DatabaseService.db.executeSql(
            'SELECT * FROM conversation', []);
    }

    /**
     * Get a conversation from its id
     * @param id_conversation
     */
    get(id_conversation: number): Promise<Conversation[]> {
        return DatabaseService.db.executeSql(
            'SELECT * FROM conversation where id_conversation = ?',
            [id_conversation]);
    }

    /**
     * Insert new conversation
     * @param conversation
     */
    set(conversation: Conversation) {
        return DatabaseService.db.executeSql(
            'SELECT * FROM conversation WHERE id_conversation = ?',
            [conversation.id_conversation])
            .then(res => {
                if (res.rows.length == 0) {
                    return DatabaseService.db.executeSql(
                        'INSERT INTO conversation (id_conversation, title,' +
                        ' timestamp) VALUES (?, ?, ?)',
                        [conversation.id_conversation, conversation.title,
                            conversation.timestamp]);

                } else {
                    // TODO: handle title update
                    return new Promise(resolve => resolve(true));
                }
            });
    }
}
