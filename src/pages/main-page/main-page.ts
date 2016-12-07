import {NavController, Toast, Events, Platform, App} from 'ionic-angular';
import { Component } from '@angular/core';
import {BackgroundGeolocation, Geolocation, Device} from 'ionic-native';
import {Dialogs} from 'ionic-native';
import { PathService } from '../../services/path-service';

import * as L from 'leaflet';

declare var omnivore: any;

let PERMISSION_DENIED = 1;
let POSITION_UNAVAILABLE = 2;
let TIMEOUT = 3;

@Component({
  templateUrl: 'main-page.html',
  providers: [PathService]

})
export class MainPage {
  private app: App;
  private map: any;
  private nav: NavController;
  private events: Events;
  public locations; // Polyline for leaflet
  private pathService: PathService;

  options: any;
  is_not_android: any;
  path: any;
  isTracking: any;
  postingEnabled: any;
  online: any;
  toggle: any;
  pace: any;
  locationAccuracy: any;
  previousLocation: any;
  provider: any;

  static get parameters() {
    return [[NavController], [Events], [Platform], [App], [PathService]];
  }
  
  constructor( _nav: NavController, _events: Events, _platform: Platform, _app: App, _pathService: PathService) {
    this.app = _app;
    this.nav = _nav;
    this.events = _events;
    this.is_not_android = !_platform.is('android');
    this.pathService = _pathService;
    
    this.options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 30000
    }


    this.path = undefined;
    this.isTracking = false;
    this.postingEnabled = false;
    this.online = false;

    this.toggle = {
      text: "Start",
      isStarted: false,
      color: 'secondary'
    }

    this.pace = {
      text: "Aggressive",
      isAgressive: false,
      color: 'secondary'
    }

    this.bindEvents();

  }

  ionViewDidEnter (){
    this.map = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);

    this.locations = L.polyline([], {color: 'red'}).addTo(this.map);

  }

  bindEvents() {
    this.events.subscribe('bgeo_callback:location',
      (location) => {
        try {
          console.log("!!!DEMO : INFO: Set Current Location from bgeo_callback");
          console.log(location);
          this.setCurrentLocation(location[0]);
        } catch (e) {
          console.error('!!!DEMO : ERROR: setting location', e.message);
        }
      }
    );
  }


  showToast(msg) {
    let toast = new Toast(this.app);
    toast.setMessage(msg);
    toast.present();
  }

  onClickToogleEnabled() {
    if (!this.toggle.isStarted) {
      this.toggle.text = "Stop";
      this.toggle.color = 'danger';
      this.startTracking();
    } else {
      this.toggle.text = "Start";
      this.toggle.color = 'secondary';
      this.stopTracking();
    }
    this.toggle.isStarted = !this.toggle.isStarted;
  }

  onClickChangePace() {
    console.log("!!!DEMO : onClickChangePace");
    if (!this.pace.isAgressive) {
      this.pace.color = 'danger';
      BackgroundGeolocation.changePace(true);
    } else {
      this.pace.color = 'secondary';
      BackgroundGeolocation.changePace(false);
    }
    this.pace.isAgressive = !this.pace.isAgressive;
  }

  startTracking() {
    console.log("!!!DEMO : Start tracking");

    // Create a new path
    this.pathService
          .Add(Device.device.uuid)
          .subscribe(
            () => {} ,
            error => console.log(error));

    BackgroundGeolocation.start();
    this.isTracking = true;
    BackgroundGeolocation.isLocationEnabled().then(
      this.onLocationCheck
    );

  }

  stopTracking() {
    console.log("!!!DEMO : Stop tracking");
    BackgroundGeolocation.stop();
    this.isTracking = false;
  }

  onLocationCheck(enabled) {
    console.log("!!!DEMO : onLocationCheck : enabled="+enabled);
    if (!enabled) {
      console.log("!!!DEMO : Execute a dialog");
      Dialogs.confirm("No location provider enabled. Should I open location setting?")
        .then(
          (number) => {
            // number == 1 <=> OK
            // number == 2 <=> Cancel
            BackgroundGeolocation.showLocationSettings();
          })
        .catch(
          (error) => {
            console.log("!!!DEMO : Failed to execute the dialog");
          });
    }
  }


  onClickHome() {
    console.log("!!!DEMO : onClickHome");
    Geolocation.getCurrentPosition(this.options)
      .then((resp) => {
        console.log("!!!DEMO : Geolocation : " + resp.coords.latitude + ", " + resp.coords.longitude);
        this.showToast("Your location is : "+ resp.coords.longitude + ", " + resp.coords.latitude);

        // center on the location
        this.map.setView([resp.coords.latitude, resp.coords.longitude],13)
        this.setCurrentLocation(resp.coords);
      })
      .catch((error) => {
        console.log("!!!DEMO : Failed to get Geolocation, errors :" + error);
        if (error.code == PERMISSION_DENIED) {
          console.log("!!!DEMO : On permission denied -> REPORT TO DEV");
          this.showToast("On permission denied -> REPORT TO DEV");
        } else if ( error.code == POSITION_UNAVAILABLE ) {
          console.log("!!!DEMO : On position unavailable -> switch on location, activate gps, wifi network");
          this.showToast("On position unavailable -> switch on location, activate gps, wifi network");
        } else if ( error.code == TIMEOUT ) {
            console.log("!!!DEMO : On timeout -> switch on location, activate gps, wifi network -> wait");
          this.showToast("On timeout -> switch on location, activate gps, wifi network -> wait");
        }
      });
  }

  onClickReset() {
    console.log("!!!DEMO : onClickReset");
    // Clear prev location markers.
  }

  // Update screen according to new location
  setCurrentLocation(location) {
    console.log("!!!DEMO : setCurrentLocation, location: { " + Number(location.latitude) + ", " + Number(location.longitude) + "}");
    
    // Update leaflet map
    this.locations.addLatLng([location.latitude, location.longitude]);
    this.map.fitBounds(this.locations.getBounds());
  }

  // Only used for non android device
  onGetLocations() {

    BackgroundGeolocation.getLocations()
      .then(
        (res) => {
          console.log(res);
        }
      )
      .catch(
        (err) => {
          console.error("On Get Locations : error = " + err);
        }
      );
  }




}
