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

    /**
     * Avatar of the user
     */
    avatar = 'assets/shapes.svg';

    /**
     * Message to show
     */
    @Input() message: Message;

    /**
     * Is the message a temporary one (not sent)
     */
    @Input() temp: boolean;

    /**
     * Timestamp of the message
     */
    timestamp: Date;

    /**
     * Are the details shown
     */
    details: boolean = false;

    /**
     * Initialisation of the component
     */
    ngOnInit() {
        this.timestamp = new Date(this.message.timestamp);
    }

    /**
     * Name of the author of the message
     */
    get author(): User {
        if (UserService.users) {
            return UserService.users
                .filter((u: User) => u.id_user == this.message.id_user)[0]
        } else {
            return null;
        }
    }

    /**
     * Is the logged user the author
     */
    get isUser(): boolean {
        if (this.author) {
            return this.author.id_user == StorageService.userId;
        } else {
            return null;
        }
    }
}
