import { Component, OnInit } from '@angular/core';
import {Conversation} from "../../model/conversation";
import {ActivatedRoute, Params} from "@angular/router";
import {NgModel} from "@angular/forms";
import {Message} from "../../model/message";
import {user} from "../../app.const";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {

  conversation: Conversation;

  newMessage: NgModel;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.conversation = Conversation.getConversation(parseInt(params.id, 10));
    });
  }

  sendMessage(): void {
    if (!isNullOrUndefined(this.newMessage) && this.newMessage.toString() !== '') {
      let message = new Message(user, this.newMessage.toString(), new Date());
      this.conversation.messageList.push(message);
      this.newMessage = null;
    }
  }
}
