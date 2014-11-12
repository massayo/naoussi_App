/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />


var BasicInformationView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        var associationId = window.app.currentProfile.associationId;

        webServices.getAssociationData(associationId, function (assocData) {
            if (callback && typeof (callback) === "function") {
                callback({ associationData: assocData });
            }
        });
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ProfileMenu_Title;
    },
    footerMenuProfile: true,
    next: function () {
        this._super();

        this.nextScreen().show();
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

        // keep a reference to "this"
        var thisObject = this;

        var associationId = window.app.currentProfile.associationId;
        var cultureCode = window.app.culture;

        // Select association
        var association = dataCache.associationData.get(cultureCode, associationId);

        // Change student ID label and validation and for association
        var format = (association.studentIdFormat) ? association.studentIdFormat : '999999999';
        $("#" + this.containerId + " #studentId").mask(format);

        // If comes from Select association and the association was changed
        if (window.app.currentProfile.oldAssociationId) {
            $("#" + this.containerId + " #studentId").val('');
        }

        // Set gender
        if (window.app.currentProfile.gender) {
            $("#" + this.containerId + " #gender").val(window.app.currentProfile.gender);
        }
        
        // validate and submit
        $("#" + this.containerId + ' #profileForm').validate({
            rules: {
                studentId: {
                    required: true,
                    minlength: format.length
                },
                firstname: "required",
                lastname: "required",
                birthdate: { required: true, checkIfPastDate: true },
                email: "required",
                confirmEmail: { equalTo: "#" + this.containerId + " #email" }
                //gender: "required"
            },
            submitHandler: function (form) {
                event.preventDefault();

                var oldStudentId = window.app.currentProfile.studentId;
                var oldEmail = window.app.currentProfile.email;
                if (config.debug) { console.log(oldStudentId); }

                var formProfile = $(form).serializeObject();
                var profile = ProfileDal.getProfile(window.app.currentProfile.id);
                profile = ProfileDal.importFormObject(profile, formProfile);
                profile.associationId = window.app.currentProfile.associationId;
                profile.cultureCode = window.app.currentProfile.cultureCode;
                profile.brand = config.brand;

                if (window.app.currentProfile && window.app.isOnline) {
                    profile.password = '';

                    // Update online
                    webServices.updateProfile(oldStudentId, oldEmail, profile, function (data) {
                        profile = ProfileDal.importOnlineObject(profile, data);

                        ProfileDal.saveProfile(profile.id, profile);
                        window.app.currentProfile = profile;
                        window.app.culture = profile.cultureCode;

                        thisObject.next();
                    });
                } else {
                    // Show message: needs to be online to update profile
                    showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnlineToUpdateProfile);
                }
            }
        });
    },

    selectedAssociationChange: function () {
        // Selected association
        var associationId = $("#" + this.containerId + " #association").val();
        var association = this.getAssociation(associationId);

        var cultureCode = '';
        if (association.english && !association.french) { cultureCode = 'en-CA'; }
        else if (association.french && !association.english) { cultureCode = 'fr-CA'; }
        else { cultureCode = window.app.culture; }

        // Select preferred language
        $('#preferred-language-fieldset :radio', '#' + this.containerId).removeAttr('checked');
        var rdBtn = $('#preferred-language-fieldset #' + cultureCode, '#' + this.containerId);
        if (rdBtn.length) { rdBtn.attr('checked', 'checked'); }

        // Show the language swithcer, unless only one language is available for the selected association
        $('#preferred-language-fieldset', '#' + this.containerId).css('display', (association.english && association.french) ? '' : 'none');
    }
});
