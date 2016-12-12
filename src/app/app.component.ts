import { Component } from '@angular/core';
import { Platform , Events} from 'ionic-angular';
import { StatusBar, Splashscreen, BackgroundGeolocation, Device } from 'ionic-native';
import {MainPage} from '../pages/main-page/main-page';
import {RegisteringPage} from '../pages/registering-page/registering-page';
import {UserService} from '../services/user-service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [UserService]
})
export class MyApp {
  is_ios: boolean;
  events: Events;
  userService: UserService;


  rootPage: any;

  static get parameters() {
    return [[Platform], [Events], [UserService]];
  }
  
  constructor(platform: Platform, events: Events, _userService: UserService) {
    this.userService = _userService;
    
    //this.rootPage = MainPage;

    this.events = events;
    this.is_ios = platform.is('ios');
    platform.ready().then(() => {this.onDeviceReady();});
  }

  onDeviceReady() {
    //Control if user is already registered
    this.userService.get(Device.device.uuid).subscribe( 
      (user) => {
        if(user.phone_uuid){
          this.rootPage = MainPage;
        }
        else{
          this.rootPage = RegisteringPage;
        }
      },
      (e) => {console.log(e)}
    );

    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    StatusBar.styleDefault();
    Splashscreen.hide();

    let config = {
      desiredAccuracy: 10,
      stationaryRadius: 3,
      distanceFilter: 2,
      interval: 1000,
      notificationIcon: 'mappointer',
      notificationIconColor: '#FEDD1E',
      notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
      notificationText: 'ENV.settings.locationService', // <-- android only, customize the text of the notification
      activityType: 'Fitness',
      // url: "http://192.168.0.14:3000/locations", 
      url: "http://vps342125.ovh.net/locations", 
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
      locationService: 0, // ANDROID_DISTANCE_FILTER
      fastestInterval: 5000,
      activitiesInterval: 10000
    };

    BackgroundGeolocation.configure((location) => {this.onBGeoCallback(location);}, (err)=>{this.onBGeoError(err);}, config);

    console.log("!!!INFO: onDeviceReady ended");

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
