import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/database/user.service';
import {User} from '../../../model/user';
import {StorageService} from '../../../service/storage.service';
import {
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import {ConversationService} from '../../../service/database/conversation.service';
import {ParticipantService} from '../../../service/database/participant.service';
import {Participant} from '../../../model/participant';
import {Conversation} from '../../../model/conversation';
import {ApiService} from '../../../service/api.service';
import {DataManagerService} from '../../../service/data-manager.service';

/**
 * Modal to create a new conversation
 */
@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.page.html',
  styleUrls: ['./new-conversation.page.scss'],
})
export class NewConversationPage implements OnInit {

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

  /**
   * Users
   * @return List containing all of the known users and matching the query
   */
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

  /**
   * Tell if a user at least is selected
   * If so, a conversation can be created
   */
  get isUsersSelected(): boolean {
    let returnValue = false;
    this.selectedUsers.forEach((v: boolean) => {
      if (v) {
        returnValue = true;
      }
    });
    return returnValue;
  }

  /**
   * Constructor of NewConversationPage
   * @param loadingController
   * @param participantService
   * @param dataManager
   * @param conversationService
   * @param api
   * @param navCtrl
   * @param modalCtrl
   */
  constructor(private loadingController: LoadingController,
              private participantService: ParticipantService,
              private dataManager: DataManagerService,
              private conversationService: ConversationService,
              private api: ApiService,
              private navCtrl: NavController,
              private modalCtrl: ModalController) {
  }

  /**
   * Initialisation of the components of the page
   */
  ngOnInit() {
    this.selectedUsers = new Map<number, boolean>();
  }

  /**
   * Update the query for users
   * @param event Trigger
   */
  updateSearch(event: CustomEvent): void {
    this.searchValue = event.detail.value.toLowerCase();
  }

  /**
   * Select or deselect the given user
   * @param user
   */
  selectUser(user: User): void {
    this.selectedUsers.set(
      user.id_user,
      this.selectedUsers.get(user.id_user) ?
        !this.selectedUsers.get(user.id_user) : true
    );
  }

  /**
   * Tell if the user has been selected
   * @param user
   * @return true if the user is selected, false otherwise
   */
  isUserSelected(user: User): boolean {
    return this.selectedUsers.get(user.id_user) ?
      this.selectedUsers.get(user.id_user) : false;
  }

  /**
   * Validate the conversation and send it to the server
   */
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
    newConversationUsersId.push(StorageService.userId);

    // Check if this conversation already exists
    // If it does exists, navigate to it
    let conversationId = this.isConversationExisting(newConversationUsersId);
    if (conversationId > -1) {
      await this.loading.dismiss();
      await this.modalCtrl.dismiss();
      await this.navCtrl.navigateForward(['conversation', conversationId]);
    } else {
      let newConversation = new Conversation();
      conversationId = await this.api.addConversation(newConversation);
      await this.dataManager.synchroConversation();
      await this.addParticipants(newConversationUsersId, conversationId);
      await this.dataManager.synchroParticipants();
      await this.loading.dismiss();
      await this.modalCtrl.dismiss();
      await this.navCtrl.navigateForward(['conversation', conversationId]);
    }
  }

  /**
   * Add participant locally to the conversation
   * @param usersId
   * @param conversationId
   */
  async addParticipants(usersId: number[], conversationId: number): Promise<any> {
    if (usersId.length > 0) {
      let participant = new Participant(usersId.pop(), conversationId);
      await this.participantService.set(participant);
      await this.addParticipants(usersId, conversationId);
    }
  }

  /**
   * Check if a conversation already exists, based on the usersId
   * @param usersId List of selected users
   * @return the id of the conversation if it exists, -1 otherwise
   */
  isConversationExisting(usersId: number[]): number {
    let conversationResults = ConversationService.conversations
      .filter((conversation: Conversation) => {
          let conversationParticipants = ParticipantService.participants
            .filter((participant: Participant) =>
              participant.id_conversation == conversation.id_conversation);
          if (conversationParticipants.length == usersId.length) {
            let allParticipantsInConversation = true;
            conversationParticipants.forEach((participant: Participant) => {
              if (usersId.indexOf(participant.id_user) == -1) {
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
