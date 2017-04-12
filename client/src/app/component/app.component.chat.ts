import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate  } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';
import { ChatService, Message} from '../services/app.service.chat';
import { WindowRef } from '../gig/app.gig.window';


@Component({
 	selector: 'chat',
	templateUrl: '../html/chat_html.html',
	outputs: ['notify'],
	animations: [
		//Animation handling for nav labels.
    	trigger('labelstate', [
   			transition('void => *', [		//Starting styles on enter.
      			style({fontSize: '0px',height: '5px',width: '5px',marginTop: '40px',marginRight: '15px', opacity: '0'}),
      			animate(400)
    		]),
			transition('* => void', [		//Goal styles on exit.
      			animate(400, style({fontSize: '0px',height: '5px',width: '5px',marginTop: '40px',marginRight: '15px',opacity: '0'}))
    		])
  		])
	]
})

export class AppChatComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	currentUser: User = new User();
	loggedInSymbol: string;
	topOption: string;
	showLabels = false;
	comments: string[];
	activeMsg = '';
	document: any;

	public messages: Message[] = new Array()
	private submitted = false;
	private message = {
		author: 'testee',
		message: 'Hi mom',
	}

	constructor(private winRef: WindowRef, userService: userService, private chatService: ChatService) {
		chatService.messages.subscribe(msg => {
			this.messages.push(msg);
		})
	    this.document = winRef.nativeWindow.document;
		this.currentUser = userService.getUser();
		this.check_login(userService);
		this.message.author = this.currentUser.getName();
		if (this.message.author == '' || this.message.author == null ) {
			this.message.author = "Anonymous";
		}
	}

	ngOnInit() {
    //This will run the joinEvent function via the page's button upon the enter key being pressed. Needs tested on mobile.
    this.document.getElementById('msgInput').onkeypress = (e) => {
        if (e.keyCode==13) {
			console.log("ran");
          this.document.getElementById('triggedDiv').click();
        }
      }
  	}

	private check_login(userService: userService) {
		if (userService.getUser().getLoggedIn() == true) {
			this.loggedInSymbol = "home";
			this.topOption = "Home";
		}
		else {
			this.loggedInSymbol = "close";
			this.topOption = "Exit";
		}
	}

	public sendMsg() {
		console.log('Happenin!');
		this.message.message = this.activeMsg;
		this.chatService.messages.next(this.message);
		this.activeMsg = '';
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	private swap_view() {
		//If logged in, swap to not at Gig view.
		if(this.currentUser.getLoggedIn() == true) {
			this.emit_event('loginhome')
		}
		//If not logged in, popup the login option.
		else {
			//Insert popup trigger here. (The popup should have the leave Gig option as well)
			this.emit_event('login');
		}
	}


}
