import {User} from "./user";

/**
 * A message exchange in a conversation
 */
export class Message {

    /**
     * Author
     */
    author: User;

    /**
     * Content of the message
     */
    content: string;

    /**
     * Timestamp of the message
     */
    timestamp: Date;

    /**
     * Constructor of message
     * @param author message's author
     * @param content message's content
     * @param timestamp message's timestamp
     */
    constructor(author: User, content: string, timestamp: Date) {
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;
    }
}
