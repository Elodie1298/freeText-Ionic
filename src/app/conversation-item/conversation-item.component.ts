import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationItemComponent implements OnInit {

  avatar = 'assets/shapes.svg';

  title = 'Victor';

  content = 'Comment tu vas ?';

  constructor() { }

  ngOnInit() {}

}
