import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {isNullOrUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that store global variables
 */
export class StorageService {

  /**
   * Id of the logged user
   */
  static userId: number;

  /**
   * Constructor of Storage service
   * @param storage
   */
  constructor(private storage: Storage) {
  }


  /**
   * Check if the user is known
   */
  async isFirstLaunch(): Promise<boolean> {
    let userId = await this.storage.get('userId');
    if (userId) {
      StorageService.userId = userId;
    }
    return isNullOrUndefined(userId);
  }


  /**
   * Set the user id
   * @param userId
   */
  setUserId(userId: number): Promise<any> {
    StorageService.userId = userId;
    return this.storage.set('userId', userId);
  }


  /**
   * Update the last conversation synchronisation timestamp
   */
  setConversationSynchroTime(): Promise<any> {
    return this.storage.set('conversationSynchroTime', new Date());
  }

  /**
   * Get the last conversation synchronisation timestamp
   */
  getConversationSynchroTime(): Promise<any> {
    return this.storage.get('conversationSynchroTime');
  }


  /**
   * Update the last message synchronisation timestamp
   */
  setMessageSynchroTime(): Promise<any> {
    return this.storage.set('messageSynchroTime', new Date());
  }

  /**
   * Get the last message synchronisation timestamp
   */
  getMessageSynchroTime(): Promise<any> {
    return this.storage.get('messageSynchroTime');
  }


  /**
   * Update the last participant synchronisation timestamp
   */
  setParticipantSynchroTime(): Promise<any> {
    return this.storage.set('participantSynchroTime', new Date());
  }

  /**
   * Get the last participant synchronisation timestamp
   */
  getParticipantSynchroTime(): Promise<any> {
    return this.storage.get('participantSynchroTime');
  }
}
