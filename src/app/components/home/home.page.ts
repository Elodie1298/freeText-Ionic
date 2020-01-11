import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {Conversation} from "../../model/conversation";
import {isNullOrUndefined} from "util";
import {Message} from "../../model/message";
import {User} from "../../model/user";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    conversations: Conversation[];

    constructor(private api: ApiService) {
    }

    ngOnInit(): void {
        this.api.getAllConversations()
            .then(result => {
                let conversations = new Map<number, Conversation>();
                for (let row of result) {
                    let conversation = Conversation.getConversation(row.id_conversation, row.title)
                    let user = User.getUser(row.id_user, row.name);
                    if (!conversation.participants.includes(user)) {
                        conversation.participants.push(user);
                    }
                    if (!isNullOrUndefined(row.content)) {
                        let message = new Message(user, row.content, new Date(row.timestamp));
                        conversation.messageList.push(message);
                    }
                }
                this.conversations = new Array<Conversation>();
                Conversation.conversations.forEach((conversation, _) => {
                    this.conversations.push(conversation);
                });
            })
            .catch(error => console.log(error));
    }

}
