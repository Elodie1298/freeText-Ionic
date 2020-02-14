import {Component} from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {StorageService} from './service/storage.service';
import {DatabaseService} from './service/database/database.service';
import {DataManagerService} from './service/data-manager.service';
import {NotificationService} from './service/notification.service';

/**
 * App Component
 * Main component - Handle the launch of the app
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  /**
   * Constructor of AppComponent
   * @param platform
   * @param splashScreen
   * @param statusBar
   * @param storageService
   * @param navCtrl
   * @param database
   * @param notification
   * @param dataManager
   */
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private storageService: StorageService,
              private navCtrl: NavController,
              private database: DatabaseService,
              private notification: NotificationService,
              private dataManager: DataManagerService) {
    this.initializeApp()
      .catch(error => console.log(error));
  }

  /**
   * Initializations of all the components needed to run the app
   */
  async initializeApp() {
    await this.platform.ready();
    await this.database.init();
    let isFirstLaunch = await this.storageService.isFirstLaunch();
    this.notification.setLocalNotification();
    if (!isFirstLaunch) {
      await this.dataManager.startSynchro();
      await this.navCtrl.navigateRoot('/home', {animated: false});
    }
    this.statusBar.styleBlackTranslucent();
    this.splashScreen.hide();
  }
}
