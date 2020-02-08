import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {isNullOrUndefined} from "util";
import {ApiService} from "../../service/api.service";
import {StorageService} from "../../service/storage.service";
import {NavController} from "@ionic/angular";
import {DataManagerService} from '../../service/data-manager.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  name: FormControl;
  phoneNumber: FormControl;

  constructor(private api: ApiService,
              private storage: StorageService,
              private navCtrl: NavController,
              private dataManager: DataManagerService) { }

  ngOnInit() {
    this.name = new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
    ]);
    this.phoneNumber = new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{10}')
    ]);
  }

  send(): void {
    if (isNullOrUndefined(this.name.errors) && isNullOrUndefined(this.phoneNumber.errors)) {
      console.log('sending: ', this.name.value, this.phoneNumber.value);
      this.api.login(this.name.value, this.phoneNumber.value)
          .then(res => {
              console.log(res);
              this.storage.setUserId(res.id_user)
                  .then(_ => this.dataManager.startSynchro())
              this.navCtrl.navigateForward('/home');
          })
          .catch(err => console.log(err));
    } else {
      console.log('error');
    }
  }

}
