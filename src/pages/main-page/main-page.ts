import {NavController, Toast, Events, Platform, App} from 'ionic-angular';
import { Component } from '@angular/core';
import {BackgroundGeolocation, Geolocation} from 'ionic-native';
import {Dialogs} from 'ionic-native';

import * as L from 'leaflet';

declare var omnivore: any;

let PERMISSION_DENIED = 1;
let POSITION_UNAVAILABLE = 2;
let TIMEOUT = 3;

@Component({
  templateUrl: 'main-page.html'
})
export class MainPage {
  private app: App;
  private map: any;
  private nav: NavController;
  private events: Events;

  options: any;
  is_not_android: any;
  locations: any;
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
    return [[NavController], [Events], [Platform]];
  }
  constructor(_nav: NavController, _events: Events, _platform: Platform, _app: App) {
    this.app = _app;
    this.nav = _nav;
    this.events = _events;
    this.is_not_android = !_platform.is('android');

    this.options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 30000
    }


    this.path = undefined;
    this.locations = [];
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
    var latlngs = [
        [48.787105, 2.456750],
        [48.780757, 2.459475],
        [48.767011, 2.472028]
    ];
    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(this.map);
    // zoom the map to the polyline
    this.map.fitBounds(polyline.getBounds());

    /*let runLayer = omnivore.gpx("assets/gpx/Mollard.gpx");
    runLayer.on('ready', () => {
        this.map.fitBounds(runLayer.getBounds());
      });
    runLayer.addTo(this.map);*/

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
    let locations = this.locations;
    for (let n=0, len=locations.length;n<len;n++) {
      locations[n].setMap(null);
    }
    this.locations = [];
  }

  // Update screen according to new location
  setCurrentLocation(location) {
    console.log("!!!DEMO : setCurrentLocation, location: { " + Number(location.latitude) + ", ", Number(location.longitude) + "}");
    console.log(location);

    // Draw path into map
    BackgroundGeolocation.getLocations().then(
      (res) => {
        this.updateLeafletMap(res);
      }
    );
  }

  updateLeafletMap(locations){

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
