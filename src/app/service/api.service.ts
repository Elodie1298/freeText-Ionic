import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {Conversation} from '../model/conversation';
import {StorageService} from './storage.service';
import {Message} from '../model/message';
import {Participant} from '../model/participant';
import {integerToTimestamp} from '../app.const';
import {map, timeout} from 'rxjs/operators';
import {SecurityService} from './security.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that connect to APi endpoints
 */
export class ApiService {

  /**
   * Timeout for the http requests
   */
  timeout = 3000;

  /**
   * Constructor of ApiService
   * @param http
   * @param storage
   */
  constructor(private http: HttpClient,
              private security: SecurityService,
              private storage: StorageService) {
  }


  /**
   * Log the user at the app first opening
   * @param name Name of the user
   * @param phoneNumber Phone number of the user
   */
  login(name: string, phoneNumber: string): Promise<{ id_user: number }> {
    let url = `${environment.api}/login`;
    let body = new URLSearchParams();
    body.set('name', name);
    body.set('phoneNumber', phoneNumber);
    return this.http.post(url, body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<{ id_user: number }>;
  }


  /**
   * Get user's information
   * @param id_user Id of the user
   */
  getUser(id_user: number): Promise<User[]> {
    let url = `${environment.api}/user?id_user=${id_user}`;
    return this.http.get(url)
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<User[]>;
  }


  /**
   * Get all users information
   */
  getUsers(): Promise<User[]> {
    let url = `${environment.api}/user`;
    return this.http.get(url)
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<User[]>;
  }


  /**
   * Get user's conversations
   */
  async getConversations(): Promise<Conversation[]> {
    let url = `${environment.api}/conversations?id_user=${StorageService.userId}`;
    let timestamp = await this.storage.getConversationSynchroTime();
    if (timestamp) {
      let timestampString = integerToTimestamp(new Date(timestamp).getTime());
      url += `&timestamp=${timestampString}`;
    }
    return this.http.get(url)
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<Conversation[]>;
  }


  /**
   * Add new conversation
   * @param conversation Conversation to save
   */
  addConversation(conversation: Conversation) {
    let url = `${environment.api}/conversations`;
    let body = new URLSearchParams();
    body.set('title', conversation.title);
    body.set('timestamp', integerToTimestamp(conversation.timestamp));
    return this.http.post(url, body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<number>;
  }


  /**
   * Get user's messages
   */
  async getMessages(): Promise<Message[]> {
    let url = `${environment.api}/messages?id_user=${StorageService.userId}`;
    let timestamp = await this.storage.getMessageSynchroTime();
    if (timestamp) {
      let timestampString = integerToTimestamp(new Date(timestamp).getTime());
      url += `&timestamp=${timestampString}`;
    }
    return this.http.get(url)
      .pipe(timeout(this.timeout))
      .pipe(map((messages: Message[]) => {
        messages.forEach(async (m: Message) =>
          await this.security.decrypt(m));
        return messages;
      }))
      .toPromise() as Promise<Message[]>;
  }


  /**
   * Add new message
   * @param message Message to save
   */
  addMessage(message: Message): Promise<number> {
    let url = `${environment.api}/messages`;
    let body = new URLSearchParams();
    body.set('id_user', message.id_user.toString());
    body.set('id_conversation', message.id_conversation.toString());
    body.set('timestamp', integerToTimestamp(message.timestamp));
    return this.security.encrypt(message)
      .then((encryptedMessage: Message) => {
        body.set('content', encryptedMessage
          .content.replace('\'', '\'\''));
        return this.http.post(url, body.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .pipe(timeout(this.timeout))
          .toPromise() as Promise<number>;
      })
  }


  /**
   * Get user's linked participant
   */
  async getParticipants(): Promise<Participant[]> {
    let url = `${environment.api}/participants?id_user=${StorageService.userId}`;
    let timestamp = await this.storage.getParticipantSynchroTime();
    if (timestamp) {
      let timestampString = integerToTimestamp(timestamp);
      url += `&timestamp=${timestampString}`;
    }
    return this.http.get(url)
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<Participant[]>;
  }


  // noinspection DuplicatedCode,DuplicatedCode
  /**
   * Add new participant
   * @param participant Participant to save
   */
  addParticipant(participant: Participant): Promise<any> {
    let url = `${environment.api}/participants`;
    let body = new URLSearchParams();
    body.set('id_user', participant.id_user.toString());
    body.set('id_conversation', participant.id_conversation.toString());
    body.set('nickname', participant.nickname);
    body.set('timestamp', integerToTimestamp(participant.timestamp));
    integerToTimestamp(participant.timestamp);
    return this.http.post(url, body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .pipe(timeout(this.timeout))
      .toPromise() as Promise<number>;
  }
}
