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
    await this.synchroConversation();
    await this.synchroMessages();
    await this.synchroParticipants();
    await this.synchroUser();
    await this.notification.sendNotifications();
    console.log('----- APP READY -----');
    // TODO:
    //  - do the synchronization regularly
    //  - if there is a network error:
    //      - watch the network status
    //      - wait to have internet connection and retry
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
  async synchroMessages() {
    let messagesTemp = await this.messageService.getAllTemp();
    await this.saveMessages(messagesTemp);
    let messages = await this.api.getMessages();
    await this.addMessages(messages);
    await this.messageService.updateLists();
    await this.storage.setMessageSynchroTime();
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
  async synchroParticipants(): Promise<any> {
    let participants = await this.participantService.getAllTemp();
    await this.saveParticipants(participants);
    participants = await this.api.getParticipants();
    await this.addParticipants(participants);
    await this.participantService.updateLists();
    await this.storage.setParticipantSynchroTime();
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
  async synchroConversation(): Promise<any> {
    let conversations = await this.api.getConversations();
    await this.addConversations(conversations);
    await this.conversationService.updateList();
    await this.storage.setConversationSynchroTime();
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
    let usersId = await this.userService.getMissingUsers();
    await this.userService.updateList();
    await this.addUsers(usersId);
  }

  /**
   * Insert multiple users in local database based on users' id
   * @param usersId
   */
  private async addUsers(usersId: { id_user: number }[]): Promise<any> {
    if (usersId.length > 0) {
      let userId = usersId.pop();
      let user = await this.api.getUser(userId.id_user);
      await this.userService.set(user[0]);
      await this.addUsers(usersId);
    }
  }
}
