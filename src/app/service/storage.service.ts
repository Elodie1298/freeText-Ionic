import { Injectable } from '@angular/core';
import {Conversation} from "../model/conversation";
import {Storage} from "@ionic/storage";
import {isNullOrUndefined} from "util";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {}

  updateConversations(): Promise<any> {
    return this.storage.set('conversations', Conversation.conversations);
  }

  loadConversations(): Promise<any> {
    return new Promise<any>(resolve => {
      this.storage.get('conversations')
          .then((conversations: Map<number, Conversation>) => {
            if (isNullOrUndefined(conversations)) {
              Conversation.conversations = new Map<number, Conversation>();
            } else {
              Conversation.conversations = conversations;
            }
            resolve(true);
          });
    })
  }

}
