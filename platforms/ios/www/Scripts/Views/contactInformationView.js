/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var ContactInformationView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        webServices.getProvinces(function (provinceData) {
            if (callback && typeof (callback) === "function") {
                callback({ provinces: provinceData });
            }
        });
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
        $("#" + this.containerId + " #postalCode").mask("a9a 9a9");
        $("#" + this.containerId + " #phone1").mask("(999) 999-9999? x99999");
        $("#" + this.containerId + " #phone2").mask("(999) 999-9999? x99999");

        // Select province
        $("#" + this.containerId + " #province").val(window.app.currentProfile.provinceCode);

        var chbxA = $('#isPhone1Mobile', '#' + this.containerId);
        var chbxB = $('#isPhone2Mobile', '#' + this.containerId);

        chbxA.removeAttr('checked');
        if (window.app.currentProfile.phone1IsMobile)
            chbxA.attr('checked', 'checked');

        chbxB.removeAttr('checked');
        if (window.app.currentProfile.phone2IsMobile)
            chbxB.attr('checked', 'checked');

        var bottomSection = $('#mobile-preferences-section', '#' + this.containerId);
        bottomSection.css('display', (chbxA.is(':not(:checked)') && chbxB.is(':not(:checked)')) ? 'none' : '');

        $('#isPhone1Mobile,#isPhone2Mobile', '#' + this.containerId).on('click', function () {
            bottomSection.css('display', (chbxA.is(':not(:checked)') && chbxB.is(':not(:checked)')) ? 'none' : '');
        });

        if (window.app.currentProfile.receiveMsgOnMobile) {
            $('#receiveMsgOnMobileNo', '#' + this.containerId).removeAttr('checked');
            $('#receiveMsgOnMobileYes', '#' + this.containerId).attr('checked', 'checked');
        }

        // Validation
        var thisObject = this;
        $("#" + this.containerId + ' #profileForm').validate({
            rules: {

            }, 
            invalidHandler: function (form, validator) {
                $("#" + thisObject.containerId + ' #validationError').show();
            },
            submitHandler: function (form) {
                event.preventDefault();
                $("#" + thisObject.containerId + ' #validationError').hide();

                if (window.app.currentProfile) {
                    var oldStudentId = window.app.currentProfile.studentId;
                    var oldEmail = window.app.currentProfile.email;
                    if (config.debug) { console.log(oldStudentId); }

                    var formProfile = $(form).serializeObject();
                    formProfile.province = $('#' + thisObject.containerId + ' #province').val();
                    if (!formProfile.phone1IsMobile) formProfile.phone1IsMobile = false;
                    if (!formProfile.phone2IsMobile) formProfile.phone2IsMobile = false;
                    
                    var profile = ProfileDal.getProfile(window.app.currentProfile.id);
                    profile = ProfileDal.importFormObject(profile, formProfile);
                    profile.brand = config.brand;

                    // Update online
                    if (window.app.isOnline) {
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
