import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../model/message';
import {StorageService} from '../../../service/storage.service';
import {User} from '../../../model/user';
import {UserService} from '../../../service/database/user.service';

/**
 * Message component
 */
@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

    avatar = 'assets/shapes.svg';

    @Input() message: Message;

    timestamp: Date;

    details: boolean = false;

    ngOnInit() {
        this.timestamp = new Date(this.message.timestamp);
    }

    get author(): User {
        if (UserService.users) {
            return UserService.users
                .filter((u: User) => u.id_user == this.message.id_user)[0]
        } else {
            return null;
        }
    }

    get isUser(): boolean {
        if (this.author) {
            return this.author.id_user == StorageService.userId;
        } else {
            return null;
        }
    }
}
