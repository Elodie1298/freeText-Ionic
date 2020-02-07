import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Message} from '../../model/message';

@Injectable({
    providedIn: 'root'
})
/**
 * Service that manage participants in local database
 */
export class MessageService {

    /**
     * Get all messages stored in the temporary database
     */
    getAllTemp(): Promise<Message[]> {
        return DatabaseService.db.executeSql(
            'select * from message_temp', []);
    }

    /**
     * Get messages for a given conversation
     * @param id_conversation
     */
    getForConversation(id_conversation: number): Promise<Message[]> {
        return DatabaseService.db.executeSql(
            'select * from message where id_conversation = ?',
            [id_conversation]);
    }

    /**
     * Get unsent messages for a given conversation
     * @param id_conversation
     */
    getForConversationTemp(id_conversation: number): Promise<Message[]> {
        return DatabaseService.db.executeSql(
            'select * from message_temp where id_conversation = ?',
            [id_conversation]);
    }

    /**
     * Insert message into the appropriate database
     * @param message
     * @param fromServer
     */
    set(message: Message, fromServer: boolean=false): Promise<any> {
        let query: string;
        let params: any[];
        if (fromServer) {
            query = 'insert into message (id_message, id_conversation,' +
                ' id_user, content, timestamp) values (?, ?, ?, ?, ?)';
            params = [message.id_message, message.id_conversation,
                message.id_user, message.content, message.timestamp];
        } else {
            query = 'insert into message_temp (id_conversation,' +
                ' id_user, content, timestamp) values (?, ?, ?, ?, ?)';
            params = [message.id_conversation, message.id_user,
                message.content, message.timestamp];
        }
        return DatabaseService.db.executeSql(query, params);
    }

    /**
     * Delete message from temporary table
     * @param message
     */
    private deleteTemp(message: Message): Promise<any> {
        return DatabaseService.db.executeSql(
            'delete from message_temp where id_message = ?',
            [message.id_message]);
    }

    /**
     * Save a message that has been saved to the server
     * @param message
     * @param server_id
     */
    save(message, server_id): Promise<any> {
        return this.deleteTemp(message)
            .then(_ => {
                message.id_message = server_id;
                return this.set(message, true);
            })
    }
}
