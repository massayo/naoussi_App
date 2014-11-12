/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var DependentList = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        var dependants = ProfileDal.listAllDependents(window.app.currentProfile);
        var hasDependants = (dependants && dependants.length > 0);

        if (callback && typeof (callback) === "function") {
            callback({ dependants: dependants, hasDependants: hasDependants });
        }
    },

    afterShow: function () {
        this._super();
        // keep a reference to "this"
        var thisObject = this;

        //$('.dependent-btn-edit', '#' + this.containerId).html(dataCache.dictionary.get(window.app.culture).Dependent_List_ModifyDependent);
        $('.dependent-btn-edit', '#' + this.containerId).click(function () {
            thisObject.modifyDependent($(this).attr('data-dependentid'));
        });

        //$('.dependent-btn-delete', '#' + this.containerId).html(dataCache.dictionary.get(window.app.culture).Dependent_List_DeleteDependent);
        $('.dependent-btn-delete', '#' + this.containerId).click(function () {
            var thisButton = this;
            showConfirm(dataCache.dictionary.get(window.app.culture).Dependent_List_DeleteDependent_Confirm_Message, function () {
                thisObject.deleteDependent($(thisButton).attr('data-dependentid'));
            });
        });
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ProfileMenu_Title;
    },
    footerMenuProfile: true,
    next: function (screen) {
        this._super();
        screen.show();
    },

    hasBackButton: function () { return true; },
    back: function () { window.app.screens.profile.show(); },

    addDependent: function () {
        var screen = this.nextScreen().addDependent;
        screen.setModel(null);
        this.next(screen);
    },

    cancel: function () {
        this.next(this.nextScreen().cancel);
    },

    modifyDependent: function (dependentId) {
        var screen = this.nextScreen().modifyDependent;
        screen.setModel(ProfileDal.getDependent(window.app.currentProfile, dependentId));
        this.next(screen);
    },

    deleteDependent: function (dependentId) {
        webServices.deleteDependent(dependentId, window.app.currentProfile, function (data) {
            // update the profile
            var profile = ProfileDal.getProfile(window.app.currentProfile.id);
            profile = ProfileDal.importOnlineObject(profile, data);
            ProfileDal.saveProfile(profile.id, profile);
            window.app.currentProfile = profile;
            // reload the view
            window.app.screens.dependentList.show();
        });
    },

    wizard: function () {
        var screen = this.nextScreen().wizard;
        this.next(screen);
    }
});
