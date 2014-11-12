/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />
/// <reference path="../claims.js" />

var MainMenuView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        // Check if has claims
        webServices.getClaimHistory(app.currentProfile, app.forceReloadClaimHistory, function (data) {
            var hasClaims = (data && data.length > 0);

            Claims.listFailedClaims(function (failedClaims) {
                var hasFailedClaims = (failedClaims && failedClaims.length > 0);

                if (callback && typeof (callback) === "function") {
                    callback({ hasClaims: hasClaims || hasFailedClaims, hasFailedClaims: hasFailedClaims });
                }
            });
        });
    },
    hasBackButton: function () { return true; },
    back: function () { app.screens.association.show(); },
    next: function (screen) {
        this._super();
        screen.show();
        // this.nextScreen().show();
    },
    footerMenuHome: true,
    welcome: function () {
        this.next(this.nextScreen().welcome);
    },
    benefit: function () {
        this.next(this.nextScreen().benefit);
    },
    claim: function () {
        if (app.currentProfile.completed) {
            this.next(this.nextScreen().claim);
        }
        else {
            showConfirm(dataCache.dictionary.get(window.app.culture).MainMenu_CompleteYourProfile_Popup, function () {
                window.app.screens.startProfileWizard.show();
            });
        }
    },
    claimHistory: function () {
        this.next(this.nextScreen().claimHistory);
    },
    pay: function () {
        this.next(this.nextScreen().pay);
    },
    home: function () {
        // Don't use the "this" keyword because it doesn't work when used in a callback
        window.app.screens.mainMenu.next(window.app.screens.mainMenu.nextScreen().home);
    },
    alerts: function () {
        // Don't use the "this" keyword because it doesn't work when used in a callback
        window.app.screens.mainMenu.next(window.app.screens.mainMenu.nextScreen().alerts);
    },
    support: function () {
        // Don't use the "this" keyword because it doesn't work when used in a callback
        window.app.screens.mainMenu.next(window.app.screens.mainMenu.nextScreen().support);
    },
    profile: function () {
        window.app.isInProfileWizard = false;
        // Don't use the "this" keyword because it doesn't work when used in a callback
        window.app.screens.mainMenu.next(window.app.screens.mainMenu.nextScreen().profile);
    },
    logout: function () {
        var thisObject = this;
        showConfirm(dataCache.dictionary.get(window.app.culture).Common_Logout_Confirm, function () { thisObject.executeLogout(true); });
    },
    executeLogout: function (/*bool*/isLogoutConfirmed) {
        if (!isLogoutConfirmed) return;
        window.app.isInProfileWizard = false;
        window.app.currentProfile = null;
        this.next(this.nextScreen().welcome);
    },
    more: function () {
        // Don't use the "this" keyword because it doesn't work when used in a callback
        window.app.screens.mainMenu.next(window.app.screens.mainMenu.nextScreen().more);
    },
    travel: function () {
        this.next(this.nextScreen().travel);
    }
});