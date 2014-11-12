/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />


var BenefitListView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        webServices.getBenefits(window.app.culture, window.app.currentProfile.associationId, function (benefits) {
            if (callback && typeof (callback) === "function") {
                callback({ benefits: benefits });
            }
        });

    },
    hasBackButton: function () {
        return true;
    },
    back: function () {
        this.next(this.nextScreen().back);
    },
    next: function (screen) {
        this._super();
        screen.show();
    },
    benefitDetail: function (benefitId) {
        var screen = this.nextScreen().benefitDetail;

        if (config.debug) {
            console.log(window.app.currentProfile.preferredLanguage);
            console.log(window.app.currentProfile.associationId);
        }

        var benefitItems = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId).benefitItems;

        var results = JSLINQ(benefitItems).Where(function (item) { return item.id == benefitId; }).items;

        if (results.length > 0) {
            screen.setModel(results[0]);
            this.next(screen);
        }
    }
});