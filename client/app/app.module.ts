//import './rxjs-extensions'; This seems to stop the component from loading in.
//By not including this, you may be breaking the http retrieval?

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';


import { AppLoginComponent } from './app.component.login';


@NgModule({
  imports:      [
  	BrowserModule,
  	FormsModule,
  	HttpModule,
  ],
  declarations: [ 
  	AppLoginComponent,
   ],
   bootstrap:	[ AppLoginComponent ]
})

export class AppModule { }
