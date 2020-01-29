import { Component, OnInit } from '@angular/core';
import {FormControl, NgModel, Validators} from "@angular/forms";
import {isNullOrUndefined} from "util";
import {ApiService} from "../../service/api.service";
import {StorageService} from "../../service/storage.service";
import {NavController} from "@ionic/angular";

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
              private navCtrl: NavController) { }

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
      this.api.logUser(this.name.value, this.phoneNumber.value)
          .then(res => {
              console.log(res);
              this.storage.registerUser(res);
              this.navCtrl.navigateForward('/');
          })
          .catch(err => console.log(err));
    } else {
      console.log('error');
    }
  }

}
