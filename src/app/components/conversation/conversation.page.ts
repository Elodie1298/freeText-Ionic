import {Component, OnInit} from '@angular/core';
import {Conversation} from '../../model/conversation';
import {ActivatedRoute, Params} from '@angular/router';
import {NgModel} from '@angular/forms';
import {ConversationService} from '../../service/database/conversation.service';
import {Message} from '../../model/message';
import {MessageService} from '../../service/database/message.service';
import {isNullOrUndefined} from 'util';
import {StorageService} from '../../service/storage.service';
import {DataManagerService} from '../../service/data-manager.service';
import {ParticipantService} from '../../service/database/participant.service';

/**
 * Conversation Page
 * Page to see the exchange of a conversation and interact with the others
 */
@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {

  /**
   * Id of the conversation
   */
  conversationId: number;

  /**
   * Content of the new message
   */
  newMessage: NgModel;

  /**
   * Constructor of ConversationPage
   * @param route
   * @param dataManager
   */
  constructor(private route: ActivatedRoute,
              private dataManager: DataManagerService) {
  }

  /**
   * Initialisation
   * Recover the conversation id
   */
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.conversationId = params.id;
    });
  }

  /**
   * Conversation item
   */
  get conversation(): Conversation {
    if (this.conversationId && ConversationService.conversations) {
      return ConversationService.conversations
        .filter((conv: Conversation) =>
          conv.id_conversation == this.conversationId)[0];
    } else {
      return null;
    }
  }

  get title(): string {
    return ConversationService.getTitle(this.conversationId);
  }

  /**
   * Messages of the conversation
   */
  get messages(): Message[] {
    if (this.conversationId && MessageService.messages) {
      return MessageService.messages
        .filter((m: Message) =>
          m.id_conversation == this.conversationId)
        .sort((a: Message, b: Message) =>
          a.timestamp - b.timestamp);
    } else {
      return null;
    }
  };

  /**
   * Send a new message
   */
  sendMessage(): void {
    // TODO: redo
    //  - put it in the temporary table
    //  - launch synchroMessages
    //  - error messages
    if (!isNullOrUndefined(this.newMessage) &&
      this.newMessage.toString() !== '') {
      let message = new Message(this.conversationId, StorageService.userId,
        this.newMessage.toString(), new Date());
      console.log(message); // WIP
      this.dataManager.sendMessage(message);
      this.newMessage = null;
    }
  }
}
