/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var CreateProfileView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        var associationId = window.localStorage.getItem("Selected.AssociationId");
        // var cultureCode = window.localStorage.getItem("Selected.PreferredLanguage");

        webServices.getAssociationData(associationId, function (assocData) {
            if (callback && typeof (callback) === "function") {
                callback(
                {
                    associationData: assocData
                });
            }
        });
    },
    next: function () {
        this._super();

        this.nextScreen().dependentSplash.show();
    },
    hasBackButton: function () { return true; },

    back: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.selectAssociation.show();
        });
    },

    cancel: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.welcome.show();
        });
    },

    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).Profile_CreateProcess_Title;
    },

    watchedForm: function () { return $('#profileForm', '#' + this.containerId); },

    afterShow: function () {
        this._super();
        var thisObject = this;

        var associationId = window.localStorage.getItem("Selected.AssociationId");
        var cultureCode = window.localStorage.getItem("Selected.PreferredLanguage");

        // Select association
        var association = dataCache.associationData.get(cultureCode, associationId);

        // Change student ID label and validation and for association
        var format = (association.studentIdFormat) ? association.studentIdFormat : '999999999';
        $("#" + this.containerId + " #studentId").mask(format);

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
                confirmEmail: { equalTo: "#" + this.containerId + " #email" },
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: { equalTo: "#" + this.containerId + " #password" },
                agree: "required"
            },
            invalidHandler: function (form, validator) {
                $("#" + thisObject.containerId + ' #validationError').show();
            },
            submitHandler: function (form) {
                event.preventDefault();
                $("#" + thisObject.containerId + ' #validationError').hide();

                if (window.app.isOnline) {
                    var formProfile = $(form).serializeObject();
                    var profile = ProfileDal.createProfile();

                    profile = ProfileDal.importFormObject(profile, formProfile);
                    profile.associationId = associationId;
                    profile.cultureCode = cultureCode;
                    profile.brand = config.brand;

                    //Save Online
                    showSpinner();
                    webServices.createProfile(profile, function (data) {
                        if (data) {
                            hideSpinner();
                            profile = ProfileDal.importOnlineObject(profile, data);
                            
                            ProfileDal.saveNewProfile(profile);

                            window.localStorage.setItem("Selected.AssociationId", "");

                            app.screens.createProfileConfirmation.show();
                        } else {
                            hideSpinner();
                            showAlert(dataCache.dictionary.get(window.app.culture)['Profile_Create_Fail']);
                        }
                    }, function (errorObj) {
                        hideSpinner();
                        showAlert(errorObj.message);
                    });
                } else {
                    // Show message: needs to be online to create profile -- Profile_Create_Need_Online
                    showAlert(dataCache.dictionary.get(window.app.culture)['Profile_Create_Need_Online']);
                }
            }
        });

    }

});
