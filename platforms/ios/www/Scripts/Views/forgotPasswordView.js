/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var ForgotPasswordView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },
    next: function () {
        this._super();
        this.nextScreen().show();
    },
    hasBackButton: function () { return true; },
    back: function () { window.app.screens.welcome.show(); },
    afterShow: function () {
        this._super();

        var thisObject = this;
        $("#" + this.containerId + ' #forgotPasswordForm').validate({
            rules: {
                email: "required"
            },
            submitHandler: function (form) {
                event.preventDefault();

                if (window.app.isOnline) {
                var email = $('#' + thisObject.containerId + ' #' + $(form).attr('id') + ' #email').val();
                    // Send forgot password request to service
                    webServices.sendForgotPasswordRequest(window.app.culture, email, function (data) {
                        if (data) {
                            showAlert(dataCache.dictionary.get(window.app.culture).ForgotPassword_Web_An_Email_Has_Been_Sent);
                            thisObject.next();
                        } else {
                            showAlert(dataCache.dictionary.get(window.app.culture).Common_An_Unexpected_Error_Occurred);
                        }
                    });
                } else {
                    // Show message: needs to be online to update profile
                    showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnline);
                }
            }
        });
    }
});