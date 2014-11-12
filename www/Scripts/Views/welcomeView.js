/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../libs/sha256.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />


var WelcomeView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        var profiles = ProfileDal.listAllProfiles();

        if (callback && typeof (callback) === "function") {
            callback({ profiles: profiles, rememberedProfiles: ProfileDal.listAllRememberedProfiles() });
        }

    },
    hasBackButton: function () {
        return true;
    },
    backText: function () {
        return dataCache.dictionary.get(window.app.culture).Login_Back;
    },
    back: function () {
        this.next(this.nextScreen().back);
    },
    next: function (screen) {
        this._super();
        screen.show();
    },
    nextView: function () {
        this.next(this.nextScreen().next);
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).Welcome_Login_Title;
    },
    afterShow: function () {
        this._super();
    },
    loadRemembered: function (select) {
        $("#" + this.containerId + " #email").val($(select).val());
        $("#" + this.containerId + " #rememberMe").attr('checked', 'checked');
    },
    login: function () {
        var thisObject = this;
        var email = $("#" + this.containerId + " #email").val();
        var password = $("#" + this.containerId + " #password").val();
        var loginErrorDiv = $("#" + this.containerId + " #loginError");
        var emailRequiredErrorDiv = $("#" + this.containerId + " #emailRequiredError");
        var loginEmailNotValidatedErrorDiv = $("#" + this.containerId + " #loginEmailNotValidatedError");
        var rememberMe = $("#" + this.containerId + " #rememberMe").is(':checked');

        $(loginErrorDiv).hide();
        $(emailRequiredErrorDiv).hide();
        $(loginEmailNotValidatedErrorDiv).hide();

        if (!email) {
            $(emailRequiredErrorDiv).show();
            return;
        }

        // Validate online
        if (window.app.isOnline) {
            showSpinner();
            webServices.validateLogin(email, password, function (data, locked) {
                if (data) {
                    email = email.toLowerCase();
                    // Get local Profile
                    var profile = ProfileDal.getProfileEmail(email);

                    // Create
                    if (!profile) {
                        profile = ProfileDal.createProfile();

                        // Updates the value from the online profile
                        profile = ProfileDal.importOnlineObject(profile, data);

                        // Create local profile
                        profile.rememberMe = rememberMe;
                        ProfileDal.saveNewProfile(profile);
                    }
                    else {
                        // Updates the value from the online profile
                        profile = ProfileDal.importOnlineObject(profile, data);

                        profile.rememberMe = rememberMe;
                        ProfileDal.saveProfile(profile.id, profile);
                    }

                    if (!profile.emailValidated) {
                        $(loginEmailNotValidatedErrorDiv).show();
                        hideSpinner();
                        return;
                    }

                    window.app.currentProfile = profile;
                    ProfileDal.setLastLoggedInProfile(profile);
                    window.app.culture = profile.cultureCode;

                    hideSpinner();

                    thisObject.nextView();
                } else {
                    $(loginErrorDiv).show();

                    if (locked) {
                        $(loginErrorDiv).html(dataCache.dictionary.get(window.app.culture).Welcome_Login_Locked);
                    }
                    else {
                        $(loginErrorDiv).html(dataCache.dictionary.get(window.app.culture).Welcome_Login_Invalid);
                    }

                    hideSpinner();
                }
            });
        }
        else if (!window.app.isOnline) {
            var profile = ProfileDal.getProfileEmail(email);
            if (profile && profile.email == email && profile.password == sha256_digest(password)) {
                window.app.currentProfile = profile;
                this.nextView();
            }
            else {
                $(loginErrorDiv).show();
            }
        }
    }
});