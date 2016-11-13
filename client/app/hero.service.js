"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var HeroService = (function () {
    function HeroService(http) {
        this.http = http;
        this.headers = new headers({ 'Content-Type': 'application/json' });
        this.userURL = 'app/heroes'; //URL to API location.
        this.params = new http_1.URLSearchParams();
    }
    HeroService.prototype.getUserHtml = function (userType, params) {
        params.set('UserType', userType);
        return this.http.get(this.userURL, params) //I'm trying to pass a variable to my API
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    HeroService.prototype.getHtml = function (id) {
        return this.getHeroes()
            .then(function (heroes) { return heroes.find(function (hero) { return hero.id === id; }); });
    };
    HeroService = __decorate([
        core_1.Injectable()
    ], HeroService);
    return HeroService;
}());
exports.HeroService = HeroService;
