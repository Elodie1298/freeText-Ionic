import {Component, Input, OnInit} from '@angular/core';
import {Conversation} from "../../model/conversation";
import {user} from "../../app.const";

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationItemComponent implements OnInit {

  avatar = 'assets/shapes.svg';

  @Input() conversation: Conversation;

  constructor() { }

  ngOnInit() {}

  get content(): string {
    if (this.conversation.getLastMessage().author.id == user.id) {
      return this.conversation.getLastMessage().content;
    } else {
      return this.conversation.getLastMessage().author.name + ': ' + this.conversation.getLastMessage().content;
    }
  }
}
