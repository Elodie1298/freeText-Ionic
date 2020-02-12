import {Component} from '@angular/core';
import {Conversation} from "../../model/conversation";
import {ConversationService} from "../../service/database/conversation.service";
import {ModalController} from '@ionic/angular';
import {NewConversationPage} from '../new-conversation/new-conversation.page';

/**
 * Home page - list of conversations
 */
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private modalCtrl: ModalController) {
    }

    /**
     * Getter for the conversation list
     */
    get conversations(): Conversation[] {
        return ConversationService.conversations;
    }

    /**
     * Open the modal to create a new conversation
     */
    async openModal() {
        const modal = await this.modalCtrl.create({
            component: NewConversationPage
        });
        await modal.present();
    }
}
