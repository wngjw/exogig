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
        this.notify = new core_1.EventEmitter();
    }
    AppLoginComponent.prototype.emit_event_to_mainpage = function () {
        this.notify.emit('Click from nested component1');
    };
    AppLoginComponent = __decorate([
        core_1.Component({
            selector: 'login-page',
            templateUrl: 'html/login_html.html',
            outputs: ['notify']
        })
    ], AppLoginComponent);
    return AppLoginComponent;
}());
exports.AppLoginComponent = AppLoginComponent;
