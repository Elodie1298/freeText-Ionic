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

    get conversations(): Conversation[] {
        return ConversationService.conversations;
    }

    constructor() {}

    ngOnInit(): void {}

}
