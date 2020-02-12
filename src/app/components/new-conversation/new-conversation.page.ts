import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {UserService} from '../../service/database/user.service';
import {User} from '../../model/user';
import {StorageService} from '../../service/storage.service';
import {
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import {ConversationService} from '../../service/database/conversation.service';
import {ParticipantService} from '../../service/database/participant.service';
import {Participant} from '../../model/participant';
import {Conversation} from '../../model/conversation';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../service/api.service';
import {DataManagerService} from '../../service/data-manager.service';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.page.html',
  styleUrls: ['./new-conversation.page.scss'],
})
export class NewConversationPage implements OnInit {

  /**
   * Title of the conversation
   */
  title: FormControl;

  /**
   * Search value
   */
  searchValue: string;

  /**
   * Selected participants
   * map of the id of each user and whether it is selected or not
   */
  selectedUsers: Map<number, boolean>;

  /**
   * Loading spinner for conversation creation success
   */
  loading: HTMLIonLoadingElement;

  get users(): User[] {
    if (UserService.users) {
      return UserService.users
        .filter((user: User) =>
          user.id_user != StorageService.userId &&
          (!this.searchValue ||
            user.name.toLowerCase().indexOf(this.searchValue) > -1)
        );
    } else {
      return null;
    }
  }

  get isUsersSelected(): boolean {
    let returnValue = false;
    this.selectedUsers.forEach((v: boolean) => {
      if (v) {
        returnValue = true;
      }
    });
    return returnValue;
  }

  constructor(private loadingController: LoadingController,
              private participantService: ParticipantService,
              private dataManager: DataManagerService,
              private api: ApiService,
              private navCtrl: NavController,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.title = new FormControl('');
    this.selectedUsers = new Map<number, boolean>();
  }

  updateSearch(event: CustomEvent): void {
    this.searchValue = event.detail.value.toLowerCase();
  }

  selectUser(user: User): void {
    this.selectedUsers.set(
      user.id_user,
      this.selectedUsers.get(user.id_user) ?
        !this.selectedUsers.get(user.id_user) : true
    );
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.get(user.id_user) ?
      this.selectedUsers.get(user.id_user) : false;
  }

  async validateConversation() {
    this.loading = await this.loadingController.create();
    await this.loading.present();

    // Getting new conversation user's id list
    let newConversationUsersId: number[] = [];
    this.selectedUsers
      .forEach((isSelected: boolean, userId: number) => {
        if (isSelected) {
          newConversationUsersId.push(userId);
        }
      });

    // Check if this conversation already exists
    // If it does exists, navigate to it
    let conversationId = this.isConversationExisting(newConversationUsersId);
    if (conversationId > -1) {
      await this.loading.dismiss();
      await this.modalCtrl.dismiss();
      await this.navCtrl.navigateForward(['conversation', conversationId]);
    } else {
      let newConversation =
        new Conversation(this.title.value == "" ? null : this.title.value);
      this.api.addConversation(newConversation)
        .then((newConversationId: number) => {
          conversationId = newConversationId;
          this.addParticipants(newConversationUsersId, newConversationId);
        })
        .then(_ => this.dataManager.synchroParticipants())
        .then(async _ => {
          await this.loading.dismiss();
          await this.modalCtrl.dismiss();
          await this.navCtrl
            .navigateForward(['conversation', conversationId]);
        })
    }

    // WIP
  }

  addParticipants(usersId: number[], conversationId: number): Promise<any> {
    if (usersId.length > 0) {
      let participant = new Participant(usersId.pop(), conversationId);
      return this.participantService.set(participant)
        .then(_ => this.addParticipants(usersId, conversationId))
        .catch(err => console.log(err));
    } else {
      return new Promise<any>(resolve => resolve(true));
    }
  }

  /**
   * Check if a conversation already exists, based on the usersId
   * @param usersId List of selected users
   */
  isConversationExisting(usersId: number[]): number {
    let conversationResults =  ConversationService.conversations
      .filter((conversation: Conversation) => {
          let conversationParticipants = ParticipantService.participants
            .filter((participant: Participant) =>
              participant.id_conversation == conversation.id_conversation);
          if (conversationParticipants.length == (usersId.length + 1)) {
            let allParticipantsInConversation = true;
            conversationParticipants.forEach((participant: Participant) => {
              if (!(usersId.indexOf(participant.id_user) > -1 ||
                participant.id_user == StorageService.userId)) {
                allParticipantsInConversation = false;
              }
            });
            return allParticipantsInConversation;
          } else {
            return false;
          }
        }
      );
    return conversationResults.length > 0 ?
      conversationResults[0].id_conversation : -1;
  }
}
