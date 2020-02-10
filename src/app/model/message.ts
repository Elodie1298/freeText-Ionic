/**
 * A message exchange in a conversation
 */
export class Message {

    /**
     * Id of the message
     */
    id_message: number;

    /**
     * Id of the conversation
     */
    id_conversation: number;

    /**
     * Id of the author
     */
    id_user: number;

    /**
     * Content of the message
     */
    content: string;

    /**
     * Timestamp of the message
     */
    timestamp: any;


    constructor(id_conversation: number, id_user: number, content: string, timestamp: any) {
        this.id_conversation = id_conversation;
        this.id_user = id_user;
        this.content = content;
        this.timestamp = timestamp;
    }
}
