import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../model/message";
import {user} from "../../app.const";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  avatar = 'assets/shapes.svg';

  @Input() message: Message;

  constructor() { }

  ngOnInit() {}

  isUser(): boolean {
    return this.message.author.id == user.id;
  }
}
