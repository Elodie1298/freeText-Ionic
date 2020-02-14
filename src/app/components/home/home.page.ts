import {Component, OnInit} from '@angular/core';
import {Conversation} from '../../model/conversation';
import {ConversationService} from '../../service/database/conversation.service';
import {ModalController, ToastController} from '@ionic/angular';
import {NewConversationPage} from './new-conversation/new-conversation.page';
import {MessageService} from '../../service/database/message.service';
import {Message} from '../../model/message';
import {DataManagerService} from '../../service/data-manager.service';
import {UserService} from '../../service/database/user.service';

/**
 * Home page - list of conversations
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  /**
   * Toast to show connection errors
   */
  toast: HTMLIonToastElement;

  /**
   * Constructor of HomePage
   * @param modalCtrl
   * @param toastCtrl
   * @param dataManager
   */
  constructor(private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private dataManager: DataManagerService) {
  }

  /**
   * Initialisation of the application
   */
  ngOnInit(): void {
    this.toastCtrl.create({
      message: 'The application could not connect to the server.',
      color: 'danger',
      duration: 6000
    })
      .then((toast: HTMLIonToastElement) => this.toast = toast);
  }
  /**
   * Get the list of conversation containing messages and sorted
   * @return the list of all conversations
   */
  get conversations(): Conversation[] {
    if (MessageService.messages) {
      // Don't show conversation without any messages
      return ConversationService.conversations
        .filter((conversation: Conversation) =>
          MessageService.messages
            .filter((message: Message) =>
              message.id_conversation == conversation.id_conversation)
            .length > 0)
        .sort((a: Conversation, b: Conversation) =>
        new Date(this.getLastMessage(b).timestamp).getTime() -
        new Date(this.getLastMessage(a).timestamp).getTime());
    } else {
      return ConversationService.conversations
    }
  }

  /**
   * Recover the last message for a conversation
   * @param conversation
   */
  getLastMessage(conversation: Conversation): Message {
    return MessageService.messages
      .filter((message: Message) =>
        message.id_conversation == conversation.id_conversation)
      .sort((mA: Message, mB: Message) =>
        new Date(mB.timestamp).getTime()-new Date(mA.timestamp).getTime())[0];
  }


  /**
   * Open the modal to create a new conversation
   */
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewConversationPage
    });
    await modal.present();
  }

  /**
   * Refresh the conversation list
   * @param event Trigger of the refresh
   */
  doRefresh(event: any) {
    this.dataManager.startSynchro()
      .then(_ => event.target.complete())
      .catch(error => {
        console.log(error);
        event.target.complete();
        this.toast.present()
          .catch(error => console.error(error));
      });
  }
}
