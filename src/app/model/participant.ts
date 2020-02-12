/**
 * Participant to a conversation
 */
export class Participant {

    /**
     * Id of the user
     */
    id_user: number;

    /**
     * Id of the conversation
     */
    id_conversation: number;

    /**
     * Nickname given to the user in that conversation
     */
    nickname?: string;

    /**
     * Timestamp when the user was added to the conversation
     */
    timestamp: any;


    constructor(id_user: number, id_conversation: number) {
        this.id_user = id_user;
        this.id_conversation = id_conversation;
        this.timestamp = new Date();
    }
}
