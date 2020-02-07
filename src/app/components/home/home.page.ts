import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {Conversation} from "../../model/conversation";
import {ConversationService} from "../../service/database/conversation.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    conversations: Conversation[] = [];

    constructor(private api: ApiService,
                private conversationService: ConversationService) {
    }

    ngOnInit(): void {
        this.conversationService.findAll()
            .then(result => {
                for (let i=0; i<result.rows.length; i++)
                this.conversations.push(result.rows.item(i));
            })
    }

}
