import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import {MainPage} from '../pages/main-page/main-page';
import {RegisteringPage} from '../pages/registering-page/registering-page';

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    RegisteringPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPage,
    RegisteringPage
  ],
  providers: []
})
export class AppModule {}
