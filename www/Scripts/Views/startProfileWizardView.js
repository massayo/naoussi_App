/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var StartProfileWizardView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ProfileMenu_Title;
    },
    footerMenuProfile: true,
    next: function () {
        this._super();
        this.nextScreen().wizard.show();
    },

    hasBackButton: function () { return true; },

    back: function () { window.app.screens.profile.show(); },

    afterShow: function () {
        this._super();

        $('.start-wizard-btn', '#' + this.containerId).on('click', function (e) {
            e.preventDefault();
            window.app.screens.contactInformation.show();
        });
    }
});
