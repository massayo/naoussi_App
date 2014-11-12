/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var CoordinationBenefitListView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        var insurers = window.app.currentProfile.insurers;
        var hasOtherInsurer = (insurers && insurers.length > 0);

        if (callback && typeof (callback) === "function") {
            callback({ insurers: insurers, hasOtherInsurer: hasOtherInsurer });
        }
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ProfileMenu_Title;
    },
    footerMenuProfile: true,
    next: function (profile) {
        this._super();

        if (profile.completed) {
            // Return to Profile Screen
            this.nextScreen().profile.show();
        } else {
            // Go to next wizard screen - Complete
            this.nextScreen().wizard.show();
        }
    },
    hasBackButton: function () { return true; },
    back: function () { window.app.screens.profile.show(); },
    add: function () {
        window.app.screens.coordinationBenefitForm.setModel(null);
        window.app.screens.coordinationBenefitForm.show();
    },
    edit: function (id) {
        var insurer = ProfileDal.getInsurer(window.app.currentProfile, id);

        if (insurer) {
            window.app.screens.coordinationBenefitForm.setModel(insurer);
            window.app.screens.coordinationBenefitForm.show();
        }
    },
    deleteItem: function (id) {
        var thisObject = this;
        showConfirm(dataCache.dictionary.get(window.app.culture).CoordinationBenefits_List_DeleteItem_Confirm_Message,
            function () { thisObject.deleteInsurer(id); });
    },
    deleteInsurer: function (id) {
        var thisObject = this;

        webServices.deleteInsurer(id, window.app.currentProfile, function (data) {
            var profile = window.app.currentProfile;

            // Updates the value from the online profile
            profile = ProfileDal.importOnlineObject(profile, data);

            ProfileDal.saveProfile(profile.id, profile);

            thisObject.show();
        });
    }
});
