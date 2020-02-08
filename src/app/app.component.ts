import { Component } from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {StorageService} from "./service/storage.service";
import {DatabaseService} from "./service/database/database.service";
import {DataManagerService} from './service/data-manager.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    initialized = false;

    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private storageService: StorageService,
                private navCtrl: NavController,
                private database: DatabaseService,
                private dataManager: DataManagerService) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready()
            .then(_ => this.database.init())
            .then(_ => this.storageService.isFirstLaunch())
            .then((isFirstLaunch: boolean) => {
                if (isFirstLaunch) {
                    return new Promise(resolve => resolve(true));
                } else {
                    this.dataManager.startSynchro();
                    return this.navCtrl.navigateForward('/home', {animated: false});
                }
            })
            .then(_ => {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
                this.initialized = true;
            })
            .catch(error => console.log(error));
    }
}
