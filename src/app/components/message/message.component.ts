import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../model/message';
import {user} from '../../app.const';
import {StorageService} from '../../service/storage.service';
import {User} from '../../model/user';
import {UserService} from '../../service/database/user.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

    avatar = 'assets/shapes.svg';

    @Input() message: Message;

    isUser: boolean;

    timestamp: Date;

    author: User;

    constructor(private storage: StorageService,
                private userService: UserService) {}

    ngOnInit() {
        this.timestamp = new Date(this.message.timestamp);
        this.storage.getUserId()
            .then((userId: number) =>
                this.isUser = this.message.id_user === userId);
        this.userService.get(this.message.id_user)
            .then((user: User[]) => this.author = user[0]);
    }
}
