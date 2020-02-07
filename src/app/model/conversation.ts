/**
 * A conversation between participant
 */
export class Conversation {

    /**
     * Id of the conversation
     */
    id_conversation: number;

    /**
     * Title of the conversation
     */
    title?: string;

    /**
     * Timestamp of the creation of the conversation
     */
    timestamp: any;

    /**
     * Is the conversation present on the server
     */
    synchronized?: boolean;
}
