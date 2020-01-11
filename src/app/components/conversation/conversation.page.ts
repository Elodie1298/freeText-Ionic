import { Component, OnInit } from '@angular/core';
import {Conversation} from "../../model/conversation";
import {ActivatedRoute, Params} from "@angular/router";
import {NgModel} from "@angular/forms";

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

}
