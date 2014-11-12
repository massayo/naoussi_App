/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var DependentSplash = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },
    afterShow: function () {
        this._super();

        $("#" + this.containerId + ' #dependentForm').validate({
            rules: {
                gender: "required"
            },
            submitHandler: function (form) {
                event.preventDefault();
                if (config.debug) { console.log(form); }

                ProfileDal.saveProfile(ProfileDal.listAllProfiles.length, $(form).serializeObject());

                thisObject.next();
            }
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
    addDependent: function () {
        this.next(this.nextScreen().addDependent);
    },
    cancel: function () {
        this.next(this.nextScreen().cancel);
    }
});