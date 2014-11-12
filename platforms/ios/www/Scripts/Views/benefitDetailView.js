/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var BenefitDetailView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },
    hasBackButton: function () {
        return true;
    },
    back: function() {
        this.next(this.nextScreen().back);
    },
    next: function (screen) {
        this._super();
        screen.show();
    },
    benefitList: function () {
        this.next(this.nextScreen().benefitList);
    }
});