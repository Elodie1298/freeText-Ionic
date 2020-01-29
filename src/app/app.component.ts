import { Component } from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {StorageService} from "./service/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storageService: StorageService,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
        .then(_ => this.storageService.isFirstLaunch())
        .then((isFirstLaunch: boolean) => {
            if (isFirstLaunch) {
                return this.navCtrl.navigateForward('/start', {animated: false});
            } else {
                return new Promise(resolve => resolve(true));
            }
        })
        .then(_ => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
  }
}
