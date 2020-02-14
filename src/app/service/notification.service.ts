import {Injectable} from '@angular/core';
import {
  ILocalNotification
} from '@ionic-native/local-notifications/ngx';
import {ConversationService} from './database/conversation.service';
import {Conversation} from '../model/conversation';
import {UserService} from './database/user.service';
import {User} from '../model/user';
import {MessageService} from './database/message.service';
import {Message} from '../model/message';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that handle the notifications
 */
export class NotificationService {

  /**
   * Are the notifications part of a group
   */
  groupSummary: boolean = false;

  /**
   * Name of the group
   */
  group = 'freeText';

  /**
   * Stack of messages id
   */
  stack: number[] = [];

  /**
   * Map linking conversation's id to the new message's id for the notification badges on the home page
   */
  unreadMessages = new Map<number, number>();

  /**
   * Plugin to handle notifications
   */
  localNotification;

  /**
   * Id of the next notification
   */
  private _nextNotificationId = 0;
  get nextNotificationId(): number {
    return this._nextNotificationId++;
  }

  /**
   * Set the plugin and assure to have the permission
   */
  setLocalNotification() {
    // @ts-ignore
    this.localNotification = cordova.plugins.notification.local;
    // noinspection JSIgnoredPromiseFromCall
    this.localNotification.hasPermission(
      (permission: boolean) => permission ? null :
        this.localNotification.requestPermission());
  }

  /**
   * Add a notification to the stack
   * @param message
   */
  addNotification(message: Message): void {
    this.stack.push(message.id_message);
    this.unreadMessages.set(
      message.id_conversation,
      message.id_message
    );
  }

  /**
   * Send multiple notifications
   */
  async sendNotifications() {
    if (this.stack.length > 0) {
      let messageId = this.stack.pop();
      await this.sendNotification(messageId);
      await this.sendNotifications();
    }
  }

  /**
   * Send a notification to the device
   * @param messageId
   */
  async sendNotification(messageId: number) {
    let conversationId = await this.isNotificationForConversation(messageId);
    if (conversationId > -1) {
      // TODO: Add message to the appropriate notification
      console.log('already has notification for conversation',
        conversationId);
    } else {
      // TODO: Create new notification
      console.log('brand new notification');
      if (await this.isNeedToGroup()) {
        this.groupSummary = true;
        await this.groupNotifications();
      }
      let notification;
      let message = MessageService.messages
        .filter((m: Message) => m.id_message == messageId)[0];
      let title = ConversationService.getTitle(message.id_conversation);
      let text = [{
        person: UserService.users
          .filter((u: User) => u.id_user == message.id_user)[0].name,
        message: message.content
      }];
      if (this.groupSummary) {
        notification = {
          id: this.nextNotificationId,
          title,
          group: this.group,
          text,
          at: new Date()
        };
      } else {
        notification = {
          id: this.nextNotificationId,
          title,
          text,
          at: new Date(new Date().getTime() + 10).getTime()
        };
      }
      this.localNotification.schedule(notification);
    }
  }

  /**
   * Check if a notification already exists for the conversation
   * of the given message
   * @param messageId
   * @return -1 if there is no notification for the message's conversation,
   *         the id of the conversation otherwise
   */
  isNotificationForConversation(messageId: number): Promise<number> {
    return this.localNotification.getAllScheduled(
      (notifications: ILocalNotification[]) => {
        let conversationId: number = -1;
        notifications
          .filter((notification: ILocalNotification) => {
            let conversations = ConversationService.conversations
              .filter((conversation: Conversation) =>
                ConversationService.getTitle(conversation.id_conversation)
                == notification.title
              );
            if (conversations.length > 0) {
              conversationId = conversations[0].id_conversation;
            }
            return conversations.length > 0;
          });
        return conversationId;
      });
  }

  /**
   * If there is only one notification existing, there is a need to group
   * all notifications from this app
   */
  isNeedToGroup(): Promise<boolean> {
    return this.localNotification.getAllScheduled(
      (notifications: ILocalNotification[]) => notifications.length == 1);
  }

  /**
   * Create group and append the existing notification to it
   */
  groupNotifications(): Promise<any> {
    return this.localNotification.getAllScheduled(
      (notifications: ILocalNotification[]) => {
        let notification = notifications[0];

        // Create group summary
        this.localNotification.schedule({
          id: this.nextNotificationId,
          summary: 'FreeText',
          group: this.group,
          groupSummary: true
        });

        // Join the existing notification to the group
        this.localNotification.update({
          id: notification.id,
          group: this.group
        });
      });
  }
}
