import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../models/User';
import { FormsModule } from '@angular/forms';
import {UserService} from '../../services/user-service';
import  {MainPage} from '../main-page/main-page'
import {Device} from 'ionic-native';

/*
  Generated class for the RegisteringPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'registering-page.html',
  providers: [UserService]
})
export class RegisteringPage {
  user: User;
  userService: UserService;
  navCtrl: NavController;
  
  constructor(public _navCtrl: NavController,  _userService: UserService) {
    this.navCtrl = _navCtrl;
    this.userService = _userService;

    this.user = new User(); 
  }

  ionViewDidLoad() {
    console.log('Hello RegisteringPage');
  }

  registerUser(){
    this.user.phone_uuid = Device.device.uuid;
     this.userService
          .Add(this.user)
          .subscribe(
            () => {this.navCtrl.setRoot(MainPage)} ,
            error => console.log(error));
  }

}
