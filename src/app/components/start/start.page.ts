import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {ApiService} from '../../service/api.service';
import {StorageService} from '../../service/storage.service';
import {NavController} from '@ionic/angular';
import {DataManagerService} from '../../service/data-manager.service';

/**
 * Start page
 * The page where the user can register or login
 */
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  /**
   * Name of the user
   */
  name: FormControl;

  /**
   * Phone number of the user
   * TODO:
   *  - try getting the phone number from sim card
   *      -> no possibility of changing it
   *  - send a sms to check ???
   */
  phoneNumber: FormControl;

  /**
   * Constructor of StartPage
   * @param api
   * @param storage
   * @param navCtrl
   * @param dataManager
   */
  constructor(private api: ApiService,
              private storage: StorageService,
              private navCtrl: NavController,
              private dataManager: DataManagerService) {
  }

  /**
   * Initialisation of the forms
   */
  ngOnInit(): void {
    this.name = new FormControl('Boubou', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]);
    this.phoneNumber = new FormControl('0616203333', [
      Validators.required,
      Validators.pattern('[0-9]{10}')
    ]);
  }

  /**
   * Send the user information to log him in and access the application
   */
  send(): void {
    if (isNullOrUndefined(this.name.errors) &&
      isNullOrUndefined(this.phoneNumber.errors)) {
      this.api.login(this.name.value, this.phoneNumber.value)
        .then(res => {
          this.storage.setUserId(res.id_user)
            .then(_ => this.dataManager.startSynchro())
            .catch(err => console.log(err));
          this.navCtrl.navigateForward('/home')
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    } else {
      //TODO:
      // - handle error
      // - inform user
      console.log('error');
    }
  }
}
