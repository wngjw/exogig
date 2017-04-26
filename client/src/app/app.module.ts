//import './rxjs-extensions'; This seems to stop the component from loading in.
//By not including this, you may be breaking the http retrieval?
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }  from '@angular/forms';
import { HttpModule }    from '@angular/http';

/* Material design */
import { MdSelectModule, MdOptionModule, MdRadioModule, MdButtonModule, MdIconModule, MdCardModule, MdInputModule, MdTabsModule } from '@angular/material';

/* Component files */
import { AppLoginComponent } from './component/app.component.login';
import { AppControllerComponent } from './component/app.component.controller';
import { AppMainComponent } from './component/app.component.main';
import { AppSongListComponent } from './component/app.component.songlist';
import { AppBandPageComponent } from './component/app.component.bandpage';
import { AppBandViewerComponent } from './component/app.component.bandviewer'
import { AppChatComponent } from './component/app.component.chat';
import { AppCreateEventComponent } from './component/app.component.createevent';
import { AppEditBioComponent } from './component/app.component.editbio';
import { AppCreateSetlistComponent } from './component/app.component.makesetlist';
import { AppBandOptionsComponent } from './component/app.component.bandoptions';
import { AppCreateBandComponent } from './component/app.component.createband';
import { AppRequestComponent } from './component/app.component.request';
import { AppSetComponent } from './component/app.component.set';
import { AppNotificationsComponent } from './component/app.component.notifications';
import { AppCreateLoginHomeComponent } from './component/app.component.loginhome';
import { AppGigViewerComponent } from './component/app.component.gigviewer'

/* Old Material design, still required to handle the modal; Ideally we can remove this dependency. */
import { MaterializeDirective } from "angular2-materialize";
import { MdUniqueSelectionDispatcher } from '@angular2-material/core';

import { Ng2DragDropModule } from "ng2-drag-drop";
import { gigService } from './services/app.service.gig';
import { userService } from './services/app.service.user';
import { artistService } from './services/app.service.artist';

import { ChatService } from './services/app.service.chat';
import { WebSocketService } from './services/app.service.websocket';

import { WindowRef } from './gig/app.gig.window';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdSelectModule,
    MdOptionModule,
    MdIconModule,
    MdInputModule,
    MdTabsModule,
    MdCardModule,
    MdRadioModule,
    Ng2DragDropModule
  ],
  declarations: [
	  AppMainComponent,
  	AppLoginComponent,
  	AppControllerComponent,
  	AppSongListComponent,
  	AppBandPageComponent,
  	AppBandViewerComponent,
  	AppChatComponent,
    AppCreateBandComponent,
  	AppCreateEventComponent,
  	AppEditBioComponent,
  	AppCreateSetlistComponent,
  	AppBandOptionsComponent,
  	AppRequestComponent,
  	AppSetComponent,
  	AppNotificationsComponent,
  	AppCreateLoginHomeComponent,
	  MaterializeDirective,
    AppGigViewerComponent],

  bootstrap: [AppControllerComponent],	//From what I understand, bootstrap is basically which component it tries to setup first.
  providers: [gigService, userService, artistService, ChatService, WebSocketService, WindowRef, MdUniqueSelectionDispatcher]
})

export class AppModule { }
