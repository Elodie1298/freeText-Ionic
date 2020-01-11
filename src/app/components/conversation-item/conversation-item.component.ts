import {Component, Input, OnInit} from '@angular/core';
import {Conversation} from "../../model/conversation";

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

}
