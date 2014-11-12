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


var SecuritySettingsView = View.extend({
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
    next: function () {
        this._super();

        this.nextScreen().show();
    },
    hasBackButton: function () { return true; },
    back: function () { window.app.screens.profile.show(); },

    watchedForm: function () { return $('#profileForm', '#' + this.containerId); },

    afterShow: function () {
        this._super();
        window.app.isInProfileEdit = true;

        // Automatic logout - logoutOption
        $("#" + this.containerId + " #logoutOption-no").removeAttr('checked');
        $("#" + this.containerId + " #logoutOption-yes").removeAttr('checked');
        if (window.app.currentProfile.automaticLogout) {
            $("#" + this.containerId + " #logoutOption-yes").attr('checked', 'checked');
        } else {
            $("#" + this.containerId + " #logoutOption-no").attr('checked', 'checked');
        }

        var thisObject = this;
        $("#" + this.containerId + ' #profileForm').validate({
            rules: {
                oldPassword: {
                    required: {
                        depends: function () {
                            return $.trim($("#" + this.containerId + " #newPassword").val()).length > 0;
                        }
                    }
                },
                // newPassword: "required",
                confirmPassword: { equalTo: "#" + this.containerId + " #newPassword" }
            },
            submitHandler: function (form) {
                event.preventDefault();

                var profile = ProfileDal.getProfile(window.app.currentProfile.id);
                var formProfile = $(form).serializeObject();

                if (window.app.currentProfile && window.app.isOnline) {
                    if (formProfile.newPassword && formProfile.newPassword.length > 0) {
                        var password = formProfile.oldPassword;
                        if (profile.password == sha256_digest(password)) {
                            profile = ProfileDal.importFormObject(profile, formProfile);
                            profile.brand = config.brand;

                                if (profile.password) {
                                    profile.password = sha256_digest(profile.password);
                                }

                                var oldStudentId = window.app.currentProfile.studentId;
                                var oldEmail = window.app.currentProfile.email;
                                if (config.debug) { console.log(oldStudentId); }

                                // Update online
                                webServices.updateProfile(oldStudentId, oldEmail, profile, function (data) {
                                    profile = ProfileDal.importOnlineObject(profile, data);

                                    ProfileDal.saveProfile(profile.id, profile);
                                    window.app.currentProfile = profile;

                                    thisObject.next();
                                });

                            } else {
                                // Alert message for bad password                    
                                showAlert(dataCache.dictionary.get(window.app.culture).Profile_OldPassword_Required);
                            }
                        }
                        else {
                            profile = ProfileDal.importFormObject(profile, formProfile);
                            profile.password = '';
                            profile.brand = config.brand;

                            if (window.app.currentProfile && window.app.isOnline) {
                                var oldStudentId = window.app.currentProfile.studentId;
                                var oldEmail = window.app.currentProfile.email;
                                if (config.debug) { console.log(oldStudentId); }

                                // Update online
                                webServices.updateProfile(oldStudentId, oldEmail, profile, function (data) {
                                    profile = ProfileDal.importOnlineObject(profile, data);

                                    ProfileDal.saveProfile(profile.id, profile);
                                    window.app.currentProfile = profile;

                                    thisObject.next();
                                });
                            }
                            else {
                                showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnlineToUpdateProfile);
                            }
                        }                    
                }
                else
                {
                    // Show message: needs to be online to update profile
                    showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnlineToUpdateProfile);
                }                
            }
        });
    }
});