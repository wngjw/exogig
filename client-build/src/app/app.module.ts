//import './rxjs-extensions'; This seems to stop the component from loading in.
//By not including this, you may be breaking the http retrieval?
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppLoginComponent } from './app.component.login';
import { AppControllerComponent } from './app.component.controller';
import { AppMainComponent } from './app.component.main'
import { AppSongListComponent } from './app.component.songlist';
import { AppBandPageComponent } from './app.component.bandpage';
import { AppBandViewerComponent } from './app.component.bandviewer'
import { AppChatComponent } from './app.component.chat';
import { AppCreateEventComponent } from './app.component.createevent';
import { AppEditBioComponent } from './app.component.editbio'
import { AppCreateSetlistComponent } from './app.component.makesetlist';
import { AppRateComponent } from './app.component.rate';
import { AppRequestComponent } from './app.component.request'
import { AppSetComponent } from './app.component.set';
import { AppSongComponent } from './app.component.song';
import { AppCreateSetsComponent } from './app.component.makesets';

import { MaterializeDirective } from "angular2-materialize";
import { MdButton,MdButtonModule,MdAnchor } from '@angular2-material/button'
import { MdIcon,MdIconModule,MdIconRegistry } from '@angular2-material/icon'
import { MdInput,MdInputModule } from '@angular2-material/input'
import { MdTab,MdTabsModule,MdTabGroup,MdTabChangeEvent } from '@angular2-material/tabs'
//Consider filtering unnecessary imported modules.
import { MdCard,MdCardActions,MdCardContent,MdCardHeader,MdCardModule,MdCardTitle,MdCardSubtitle,MdCardTitleGroup } from '@angular2-material/card'
import { MdGridList,MdGridListModule } from '@angular2-material/grid-list'

import { gigService } from './services/app.service.gig';
import { userService } from './services/app.service.user';

@NgModule({
  imports:      [
  	BrowserModule,
  	FormsModule,
  	HttpModule,
	MdButtonModule,
	MdIconModule,
	MdInputModule,
	MdTabsModule,
	MdCardModule,
	MdGridListModule,
  ],
  declarations: [ 
	AppMainComponent,
  	AppLoginComponent,
  	AppControllerComponent,
  	AppMainComponent,
  	AppLoginComponent,
  	AppControllerComponent,
  	AppSongListComponent,
  	AppBandPageComponent,
  	AppBandViewerComponent,
  	AppChatComponent,
  	AppCreateEventComponent,
  	AppEditBioComponent,
  	AppCreateSetlistComponent,
  	AppRateComponent,
  	AppRequestComponent,
  	AppSetComponent,
  	AppSongComponent,
  	AppCreateSetsComponent,
	MaterializeDirective,
	
   ],
   bootstrap:	[ AppControllerComponent ],	//From what I understand, bootstrap is basically which component it tries to setup first.
   providers: [MdIconRegistry, gigService, userService]
})

export class AppModule {}