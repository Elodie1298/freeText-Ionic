import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {StorageService} from './storage.service';
import {ConversationService} from './database/conversation.service';
import {MessageService} from './database/message.service';
import {ParticipantService} from './database/participant.service';
import {UserService} from './database/user.service';
import {Message} from '../model/message';
import {Participant} from '../model/participant';
import {Conversation} from '../model/conversation';
import {User} from '../model/user';

@Injectable({
    providedIn: 'root'
})
/**
 * Service that manage the exchange and storage of data
 * between local and server databases
 */
export class DataManagerService {

    /**
     * Constructor of DataManagerService
     * @param api
     * @param storage
     * @param conversationService
     * @param messageService
     * @param participantService
     * @param userService
     */
    constructor(private api: ApiService,
                private storage: StorageService,
                private conversationService: ConversationService,
                private messageService: MessageService,
                private participantService: ParticipantService,
                private userService: UserService) {
    }

    /**
     * Start and handle the synchronisation of the databases with the server
     */
    startSynchro(): void {
        console.log('start synchro');
        this.synchroConversation()
            .then(_ => this.synchroMessages())
            .then(_ => this.synchroParticipants())
            .then(_ => this.synchroUser())
            .then(_ => {
                console.log('end synchro');
            })
            .catch(err => console.log((err)));
        // TODO:
        //  - do the synchronization regularly
        //  - if there is a network error:
        //      - watch the network status
        //      - wait to have internet connection and retry
    }

    /**
     * Do the synchronization between local and server for message table
     */
    synchroMessages(): Promise<any> {
        console.log('synchro messages');
        return this.messageService.getAllTemp()
            .then((messages: Message[]) => this.saveMessages(messages))
            .then(_ => this.api.getMessages())
            .then((messages: Message[]) => this.addMessages(messages))
            .then(_ => {
                this.messageService.updateLists();
                return this.storage.setMessageSynchroTime();
            });
    }

    /**
     * Save multiple messages on the server and manage them locally
     * @param messages
     */
    private saveMessages(messages: Message[]): Promise<any> {
        if (messages.length > 0) {
            let message = messages.pop();
            return this.api.addMessage(message)
                .then((insertId: number) => this.messageService.save(message,
                    insertId))
                .then(_ => this.saveMessages(messages));
        } else {
            return new Promise<any>(resolve => resolve(true));
        }
    }

    /**
     * Insert multiple messages coming from the server
     * @param messages
     */
    private addMessages(messages: Message[]): Promise<any> {
        if (messages.length > 0) {
            let message = messages.pop();
            return this.messageService.set(message, true)
                .then(_ => this.addMessages(messages));
        } else {
            return new Promise<any>(resolve => resolve(true));
        }
    }

    /**
     * Do the synchronization between local and server for participant table
     */
    synchroParticipants(): Promise<any> {
        return this.participantService.getAllTemp()
            .then((participants: Participant[]) =>
                this.saveParticipants(participants))
            .then(_ => this.api.getParticipants())
            .then((participants: Participant[]) =>
                this.addParticipants(participants))
            .then(_ => {
                this.participantService.updateLists();
                return this.storage.setParticipantSynchroTime();
            });
    }

    /**
     * Save multiple participants on the server and manage them locally
     * @param participants
     */
    private saveParticipants(participants: Participant[]): Promise<any> {
        if (participants.length > 0) {
            let participant = participants.pop();
            return this.api.addParticipant(participant)
                .then(_ => this.participantService.save(participant))
                .then(_ => this.saveParticipants(participants));
        } else {
            return new Promise<any>(resolve => resolve(true));
        }
    }

    /**
     * Insert multiple participants coming from the server
     * @param participants
     */
    private addParticipants(participants: Participant[]): Promise<any> {
        if (participants.length > 0) {
            let participant = participants.pop();
            return this.participantService.set(participant, true)
                .then(_ => this.addParticipants(participants));
        } else {
            return new Promise<any>(resolve => resolve(true));
        }
    }

    /**
     * Do the synchronization between local and server for conversation table
     */
    private synchroConversation(): Promise<any> {
        return this.api.getConversations()
            .then((conversations: Conversation[]) => {
                return this.addConversations(conversations);
            })
            .then(_ => {
                this.conversationService.updateList();
                return this.storage.setConversationSynchroTime();
            });
    }

    /**
     * Insert multiple conversations coming from the server
     * @param conversations
     */
    private addConversations(conversations: Conversation[]): Promise<any> {
        if (conversations.length > 0) {
            let conversation = conversations.pop();
            return this.conversationService.set(conversation)
                .then(_ => this.addConversations(conversations));
        } else {
            return new Promise<any>(resolve => resolve(true));
        }
    }

    /**
     * Do the synchronization between local and server for the user table
     */
    private synchroUser(): Promise<any> {
        return this.userService.getMissingUsers()
            .then((usersId: { id_user: number }[]) => {
                this.userService.updateList();
                return this.addUsers(usersId);
            });
    }

    /**
     * Insert multiple users in local database based on users' id
     * @param usersId
     */
    private addUsers(usersId: { id_user: number }[]): Promise<any> {
        if (usersId.length > 0) {
            let userId = usersId.pop();
            return this.api.getUser(userId.id_user)
                .then((user: User[]) => this.userService.set(user[0]))
                .then(_ => this.addUsers(usersId));
        } else {
            return new Promise<any>(resolve => resolve(true));
        }
    }
}
