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

    /**
     * Is the message present on the server
     */
    synchronized?: boolean;
}
