import { Component } from '@angular/core';
import { Platform , Events} from 'ionic-angular';
import { StatusBar, Splashscreen, BackgroundGeolocation } from 'ionic-native';
import {MainPage} from '../pages/main-page/main-page';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  is_ios: boolean;
  events: Events;

  rootPage = MainPage;

  static get parameters() {
    return [[Platform], [Events]];
  }
  
  constructor(platform: Platform, events: Events) {
    this.rootPage = MainPage;
    this.events = events;
    this.is_ios = platform.is('ios');
    platform.ready().then(() => {this.onDeviceReady();});
  }

  onDeviceReady() {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    StatusBar.styleDefault();
    Splashscreen.hide();

    console.log("BackgroundGeolocation : " + BackgroundGeolocation);

    let config = {
      desiredAccuracy: 10,
      stationaryRadius: 3,
      distanceFilter: 2,
      interval: 10000,
      notificationIcon: 'mappointer',
      notificationIconColor: '#FEDD1E',
      notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
      notificationText: 'ENV.settings.locationService', // <-- android only, customize the text of the notification
      activityType: 'AutomotiveNavigation',
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
      locationService: 0, // ANDROID_DISTANCE_FILTER
      fastestInterval: 5000,
      activitiesInterval: 10000
    };

    console.log("onDeviceReady : this=" + this);

    BackgroundGeolocation.configure((location) => {this.onBGeoCallback(location);}, (err)=>{this.onBGeoError(err);}, config);

  }


  onBGeoCallback(location) {
    console.log('!!!DEMO : BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
    this.events.publish('bgeo_callback:location', location);
    // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
    // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    if (this.is_ios) {
      BackgroundGeolocation.finish();
    }
  }

  onBGeoError(error) {
    console.error('!!!DEMO : BackgroundGeolocation error: ' + error);
  }
}
