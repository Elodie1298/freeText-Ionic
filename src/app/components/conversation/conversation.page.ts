import { Component, OnInit } from '@angular/core';
import {Conversation} from "../../model/conversation";
import {ActivatedRoute, Params} from "@angular/router";
import {NgModel} from "@angular/forms";
import {ConversationService} from '../../service/database/conversation.service';
import {Message} from '../../model/message';
import {MessageService} from '../../service/database/message.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {

  conversation: Conversation;

  get messages(): Message[] {
    return MessageService.messages;
  };

  newMessage: NgModel;

  constructor(private route: ActivatedRoute,
              private conversationService: ConversationService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.conversation = ConversationService.conversations
          .filter(conv => conv.id_conversation === params.id)[0];
    });
  }

  sendMessage(): void {
    // TODO: redo
    // if (!isNullOrUndefined(this.newMessage) && this.newMessage.toString() !== '') {
    //   let message = new Message(user, this.newMessage.toString(), new Date());
    //   this.conversation.messageList.push(message);
    //   this.newMessage = null;
    // }
  }
}
