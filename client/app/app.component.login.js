"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppLoginComponent = (function () {
    function AppLoginComponent() {
        //So when the component is loaded into view,
        //I'm going to run my http.get function.
        this.loginhtml = 'David Johnson';
    }
    AppLoginComponent.prototype.http_example = function () {
        //return this.http.get('/checkme');
        //return xmlHttp.responseText;
    };
    AppLoginComponent.prototype.getval = function () {
        return this.loginhtml = '<h3>Hi Dad.</h3>';
    };
    AppLoginComponent = __decorate([
        core_1.Component({
            selector: 'login-page',
            templateUrl: 'client/html/login_html.html'
        })
    ], AppLoginComponent);
    return AppLoginComponent;
}());
exports.AppLoginComponent = AppLoginComponent;
