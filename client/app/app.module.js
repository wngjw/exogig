//import './rxjs-extensions'; This seems to stop the component from loading in.
//By not including this, you may be breaking the http retrieval?
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var app_component_login_1 = require('./app.component.login');
var app_component_controller_1 = require('./app.component.controller');
var app_component_main_1 = require('./app.component.main');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
            ],
            declarations: [
                app_component_main_1.AppMainComponent,
                app_component_login_1.AppLoginComponent,
                app_component_controller_1.AppControllerComponent,
            ],
            bootstrap: [app_component_controller_1.AppControllerComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
