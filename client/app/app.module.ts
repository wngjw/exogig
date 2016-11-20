//import './rxjs-extensions'; This seems to stop the component from loading in.
//By not including this, you may be breaking the http retrieval?
import { NgModule }      from '@angular/core';
import { BrowserModule, ts } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppLoginComponent } from './app.component.login';
import { AppControllerComponent } from './app.component.controller';
import { AppMainComponent } from './app.component.main'




@NgModule({
  imports:      [
  	BrowserModule,
  	FormsModule,
  	HttpModule,
  ],
  declarations: [ 
	AppMainComponent,
  	AppLoginComponent,
  	AppControllerComponent,
   ],
   bootstrap:	[ AppControllerComponent ],	//From what I understand, bootstrap is basically which component it tries to setup first.
})

export class AppModule {}