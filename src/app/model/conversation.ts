import {Message} from "./message";
import {isNullOrUndefined} from "util";
import {User} from "./user";
import {user} from "../app.const";

/**
 * A conversation between participant
 */
export class Conversation {

    /**
     * Id of the conversation
     */
    id: number;

    /**
     * Title of the conversation
     */
    title: string;

    /**
     * List of participants
     */
    participants: User[];

    /**
     * List of messages of the conversation
     */
    messageList: Message[];

    /**
     * Conversation list
     */
    static conversations = new Map<number, Conversation>();

    /**
     * Constructor of conversation
     * @param id
     * @param title
     */
    private constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this.participants = new Array<User>();
        this.messageList = new Array<Message>();
        Conversation.conversations.set(id, this);
    }

    static getConversation(id: number, title?: string): Conversation {
        if (isNullOrUndefined(Conversation.conversations.get(id))) {
            new Conversation(id, title);
        }
        return Conversation.conversations.get(id);
    }

    getLastMessage(): Message {
        let lastMessage: Message;
        if (this.messageList.length > 0) {
            lastMessage = this.messageList[0];
            for (let i = 1; i < this.messageList.length; i++) {
                if (lastMessage.timestamp < this.messageList[i].timestamp) {
                    lastMessage = this.messageList[i];
                }
            }
        }
        return lastMessage
    }

    getTitle(): string {
        if (isNullOrUndefined(this.title) || this.title.length == 0) {
            let participants = this.participants.filter((u, _) => u.id != user.id);
            let title = participants[0].name;
            for (let i=1; i<participants.length; i++) {
                title += ', ' + participants[i].name;
            }
            return title;
        } else {
            return this.title;
        }
    }
}
