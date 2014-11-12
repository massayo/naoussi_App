/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var RefundPreferencesView = View.extend({
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
    next: function (profile) {
        this._super();
        
        if (window.app.isInProfileWizard) {
            // Go to next wizard screen - Complete
            this.nextScreen().wizard.show();
        } else {
            // Return to Profile Screen
            this.nextScreen().profile.show();
        }
    },
    show: function () {
        this._super();
        
        if (window.app.isInProfileWizard) {
            var associationData = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId);

            if (associationData.insurer.hideBankingInformation) {
                // Go to next wizard screen - Complete
                this.nextScreen().wizard.show();
            }
        }
    },
    hasBackButton: function () { return true; },
    back: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.profile.show();
        });
    },

    cancel: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.mainMenu.profile();
        });
    },

    watchedForm: function () { return $('#profileForm', '#' + this.containerId); },

    afterShow: function () {
        this._super();
        window.app.isInProfileEdit = true;

        // Masked input
        $("#" + this.containerId + " #bankNumber").mask("999");
        $("#" + this.containerId + " #bankTransitNumber").mask("99999");
        
        // Validation
        var thisObject = this;
        $("#" + this.containerId + ' #profileForm').validate({
            rules: {
                bankNumber: { required: true },
                bankTransitNumber: { required: true },
                bankAccountNumber: { required: true, regex: /^[0-9]+$/ }
            },
            invalidHandler: function (form, validator) {
                $("#" + thisObject.containerId + ' #validationError').show();
            },
            submitHandler: function (form) {
                event.preventDefault();

                if (window.app.currentProfile) {
                    var formProfile = $(form).serializeObject();
                    formProfile.bankInformationTransferred = false;
                    var profile = ProfileDal.getProfile(window.app.currentProfile.id);
                    profile = ProfileDal.importFormObject(profile, formProfile);
                    profile.brand = config.brand;

                    // Synch with server
                    if (window.app.isOnline) {
                        var oldStudentId = window.app.currentProfile.studentId;
                        var oldEmail = window.app.currentProfile.email;
                        if (config.debug) { console.log(oldStudentId); }

                        profile.password = '';
                        webServices.updateProfile(oldStudentId, oldEmail, profile, function (data) {
                            profile = ProfileDal.importOnlineObject(profile, data);

                            ProfileDal.saveProfile(profile.id, profile);
                            window.app.currentProfile = profile;

                            thisObject.next(profile);
                        });
                    } else {
                        // Show message: needs to be online to update profile
                        showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnlineToUpdateProfile);
                    }
                }
            }
        });
    }
});
