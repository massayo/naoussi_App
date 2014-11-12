/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />


var EditProfileView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        webServices.getProvinces(function (provinceData) {
            webServices.getAssociations(function (assocData) {
                if (callback && typeof (callback) === "function") {
                    callback(
                    {
                        provinces: provinceData,
                        associations: assocData
                    });
                }
            });
        });
    },
    next: function () {
        this._super();

        if (window.app.currentProfile) {
            this.nextScreen().settings.show();
        } else {
            this.nextScreen().dependentSplash.show();
        }
    },
    afterShow: function () {
        this._super();

        var provinceId = window.app.currentProfile.provinceCode; 
        var associationId = window.app.currentProfile.associationId; 
        var cultureCode = window.app.culture; 

        // Select province
        $("#" + this.containerId + " #province").val(provinceId);

        // Select association
        $("#" + this.containerId + " #association").val(associationId);
        var association = this.getAssociation(associationId);

        // Select & Show/hide preferred language
        var languageFieldSet = $("#" + this.containerId + " #preferred-language-fieldset");

        // Select preferred language
        $("#" + this.containerId + " #preferred-language-fieldset #english").attr('checked', '');
        $("#" + this.containerId + " #preferred-language-fieldset #french").attr('checked', '');

        if (cultureCode == 'en-CA') {
            $("#" + this.containerId + " #preferred-language-fieldset #english").attr('checked', 'checked');
        }

        if (cultureCode == 'fr-CA') {
            $("#" + this.containerId + " #preferred-language-fieldset #french").attr('checked', 'checked');
        }

        if (association.english && association.french) {
            // Show
            $(languageFieldSet).show();
        }
        else {
            // Hide
            $(languageFieldSet).hide();
        }
        var thisObject = this;
        $("#" + this.containerId + ' #profileForm').validate({
            rules: {
                //password: "required",
                confirmPassword: { equalTo: "#" + this.containerId + " #password" },
                email: "required",
                confirmEmail: { equalTo: "#" + this.containerId + " #email" },
                //gender: "required",
                birthdate: { required: true, checkIfPastDate: true },
                agree: "required"
            },
            submitHandler: function (form) {
                event.preventDefault();

                if (window.app.currentProfile && window.app.isOnline) {
                    var oldStudentId = window.app.currentProfile.studentId;
                    var oldEmail = window.app.currentProfile.email;
                    if (config.debug) { console.log(oldStudentId); }

                    var formProfile = $(form).serializeObject();
                    formProfile.province = $('#' + $(form).attr('id') + ' #province').val();

                    var profile = ProfileDal.getProfile(window.app.currentProfile.id);

                    profile = ProfileDal.importFormObject(profile, formProfile);
                    profile.brand = config.brand;

                    // Update online
                    showSpinner();
                    webServices.updateProfile(oldStudentId, oldEmail, profile, function (data) {
                        hideSpinner();
                        profile = ProfileDal.importOnlineObject(profile, data);
                        
                        ProfileDal.saveProfile(profile.id, profile);
                        window.app.currentProfile = profile;

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
        // Select association
        var associationId = $("#" + this.containerId + " #association").val();
        var association = this.getAssociation(associationId);

        // Select & Show/hide preferred language
        var languageFieldSet = $("#" + this.containerId + " #preferred-language-fieldset");

        // Select preferred language
        $("#" + this.containerId + " #preferred-language-fieldset #english").attr('checked', '');
        $("#" + this.containerId + " #preferred-language-fieldset #french").attr('checked', '');

        if (association && association.english && association.french) {
            // Show
            $(languageFieldSet).show();
        }
        else {
            // Hide
            $(languageFieldSet).hide();
        }
    }
});