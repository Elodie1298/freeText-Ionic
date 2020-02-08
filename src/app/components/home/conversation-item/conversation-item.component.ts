import {Component, Input, OnInit} from '@angular/core';
import {Conversation} from '../../../model/conversation';
import {MessageService} from '../../../service/database/message.service';
import {Message} from '../../../model/message';
import {StorageService} from '../../../service/storage.service';
import {UserService} from '../../../service/database/user.service';
import {User} from '../../../model/user';

@Component({
    selector: 'app-conversation-item',
    templateUrl: './conversation-item.component.html',
    styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationItemComponent implements OnInit {

    avatar = 'assets/shapes.svg';

    @Input() conversation: Conversation;

    constructor() {}

    ngOnInit() {}

    get content(): string {
        if (MessageService.messages) {
            let message = MessageService.messages
                .filter((message: Message) =>
                    message.id_conversation === this.conversation.id_conversation)
                .sort((a: Message, b: Message) =>
                    b.timestamp - a.timestamp)[0];
            let content = message.content;
            if (message.id_user != StorageService.userId && UserService.users) {
                let user = UserService.users
                    .filter((user: User) => user.id_user == message.id_user)[0];
                if (user) {
                    content = user.name + ': ' + content;
                }
            }
            return content;
        }
        return '';
    }
}
