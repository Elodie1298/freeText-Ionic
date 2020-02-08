import {Component} from '@angular/core';
import {Conversation} from "../../model/conversation";
import {ConversationService} from "../../service/database/conversation.service";

/**
 * Home page - list of conversations
 */
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    /**
     * Getter for the conversation list
     */
    get conversations(): Conversation[] {
        return ConversationService.conversations;
    }
}
