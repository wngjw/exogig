//import './rxjs-extensions'; This seems to stop the component from loading in.
//By not including this, you may be breaking the http retrieval?
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

/* Component files */
import { AppLoginComponent } from './component/app.component.login';
import { AppControllerComponent } from './component/app.component.controller';
import { AppMainComponent } from './component/app.component.main'
import { AppSongListComponent } from './component/app.component.songlist';
import { AppArtistPageComponent } from './component/app.component.artistpage';
import { AppArtistViewerComponent } from './component/app.component.artistviewer'
import { AppChatComponent } from './component/app.component.chat';
import { AppCreateEventComponent } from './component/app.component.createevent';
import { AppEditBioComponent } from './component/app.component.editbio'
import { AppCreateSetlistComponent } from './component/app.component.makesetlist';
import { AppArtistOptionsComponent } from './component/app.component.artistoptions';
import { AppRequestComponent } from './component/app.component.request'
import { AppSetComponent } from './component/app.component.set';
import { AppNotificationsComponent } from './component/app.component.notifications';
import { AppCreateSetsComponent } from './component/app.component.makesets';

/* Material design */
import { MaterializeDirective } from "angular2-materialize";
import { MdButton, MdButtonModule, MdAnchor } from '@angular2-material/button'
import { MdIcon, MdIconModule, MdIconRegistry } from '@angular2-material/icon'
import { MdInput, MdInputModule } from '@angular2-material/input'
import { MdTab, MdTabsModule, MdTabGroup, MdTabChangeEvent } from '@angular2-material/tabs'
import { MdCard, MdCardActions, MdCardContent, MdCardHeader, MdCardModule, MdCardTitle, MdCardSubtitle, MdCardTitleGroup } from '@angular2-material/card'
import { MdGridList, MdGridListModule } from '@angular2-material/grid-list'

import { gigService } from './services/app.service.gig';
import { userService } from './services/app.service.user';

@NgModule({
  imports: [
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
  	AppSongListComponent,
  	AppArtistPageComponent,
  	AppArtistViewerComponent,
  	AppChatComponent,
  	AppCreateEventComponent,
  	AppEditBioComponent,
  	AppCreateSetlistComponent,
  	AppArtistOptionsComponent,
  	AppRequestComponent,
  	AppSetComponent,
  	AppNotificationsComponent,
  	AppCreateSetsComponent,
	  MaterializeDirective,
  ],
  bootstrap: [AppControllerComponent],	//From what I understand, bootstrap is basically which component it tries to setup first.
  providers: [MdIconRegistry, gigService, userService]
})

export class AppModule { }
