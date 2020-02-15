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
import {NotificationService} from './notification.service';
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
   * Save error during execution
   */
  errors: any[];

  /**
   * Constructor of DataManagerService
   * @param api
   * @param storage
   * @param conversationService
   * @param messageService
   * @param notification
   * @param participantService
   * @param userService
   */
  constructor(private api: ApiService,
              private storage: StorageService,
              private conversationService: ConversationService,
              private messageService: MessageService,
              private notification: NotificationService,
              private participantService: ParticipantService,
              private userService: UserService) {
  }

  /**
   * Start and handle the synchronisation of the databases with the server
   */
  async startSynchro() {
    this.errors = [];
    await this.synchroConversation();
    await this.synchroMessages();
    await this.synchroParticipants();
    await this.synchroUser();

    await this.notification.sendNotifications();

    if (this.errors.length > 0) {
      throw Error('Error connecting to the server');
    }
    // TODO:
    //  - do the synchronization regularly
  }

  /**
   * Send a message
   * Add it to the temporary table and handle the post request to the server
   * @param message
   */
  async sendMessage(message: Message) {
    await this.messageService.set(message);
    await this.synchroMessages();
  }

  /**
   * Do the synchronization between local and server for message table
   */
  synchroMessages() {
    if (this.errors.length > 0) {
      return this.messageService.updateLists();
    } else {
      return this.messageService.getAllTemp()
        .then((m: Message[]) => this.saveMessages(m))
        .then(_ => this.api.getMessages())
        .then((m: Message[]) => this.addMessages(m))
        .then(_ => this.storage.setMessageSynchroTime())
        .then(_ => this.messageService.updateLists())
        .catch(error => {
          this.errors.push(error);
          return this.messageService.updateLists();
        });
    }
  }

  /**
   * Save multiple messages on the server and manage them locally
   * @param messages
   */
  private async saveMessages(messages: Message[]): Promise<any> {
    if (messages.length > 0) {
      let message = messages.pop();
      let insertId = await this.api.addMessage(message);
      await this.messageService.save(message, insertId);
      await this.saveMessages(messages);
    }
  }

  /**
   * Insert multiple messages coming from the server
   * @param messages
   */
  private async addMessages(messages: Message[]): Promise<any> {
    if (messages.length > 0) {
      let message = messages.pop();
      await this.messageService.set(message, true);
      await this.addMessages(messages);
    }
  }

  /**
   * Do the synchronization between local and server for participant table
   */
  synchroParticipants(): Promise<any> {
    if (this.errors.length > 0) {
      return this.participantService.updateLists();
    } else {
      return this.participantService.getAllTemp()
        .then((m: Participant[]) => this.saveParticipants(m))
        .then(_ => this.api.getParticipants())
        .catch(error => {
          this.errors.push(error);
          return this.api.getParticipants();
        })
        .then((m: Participant[]) => this.addParticipants(m))
        .then(_ => this.storage.setParticipantSynchroTime())
        .then(_ => this.participantService.updateLists())
        .catch(error => {
          this.errors.push(error);
          return this.participantService.updateLists();
        });
    }
  }

  /**
   * Save multiple participants on the server and manage them locally
   * @param participants
   */
  private async saveParticipants(participants: Participant[]): Promise<any> {
    if (participants.length > 0) {
      let participant = participants.pop();
      await this.api.addParticipant(participant);
      await this.participantService.save(participant);
      await this.saveParticipants(participants);
    }
  }

  /**
   * Insert multiple participants coming from the server
   * @param participants
   */
  private async addParticipants(participants: Participant[]): Promise<any> {
    if (participants.length > 0) {
      let participant = participants.pop();
      await this.participantService.set(participant, true);
      await this.addParticipants(participants);
    }
  }

  /**
   * Do the synchronization between local and server for conversation table
   */
  synchroConversation(): Promise<any> {
    return this.api.getConversations()
      .then((c: Conversation[]) => this.addConversations(c))
      .then(_ => this.storage.setConversationSynchroTime())
      .then(_ => this.conversationService.updateList())
      .catch(error => {
        this.errors.push(error);
        return this.conversationService.updateList();
      });
  }

  /**
   * Insert multiple conversations coming from the server
   * @param conversations
   */
  private async addConversations(conversations: Conversation[]): Promise<any> {
    if (conversations.length > 0) {
      let conversation = conversations.pop();
      await this.conversationService.set(conversation);
      await this.addConversations(conversations);
    }
  }

  /**
   * Do the synchronization between local and server for the user table
   */
  private async synchroUser(): Promise<any> {
    if (this.errors.length == 0) {
      let users = await this.api.getUsers();
      await this.addUsers(users);
    }
    await this.userService.updateList();
  }

  /**
   * Insert multiple users in local database based on users' id
   * @param users
   */
  private async addUsers(users: User[]): Promise<any> {
    if (users.length > 0) {
      let user = users.pop();
      await this.userService.set(user);
      await this.addUsers(users);
    }
  }
}
