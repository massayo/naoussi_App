/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var LoadingApplicationView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            var thisObject = this;
            webServices.checkVersion(function (data) {
                if (data !== null) {
                    if (!data) {
                        // Stop loading - Show message that the version is too old
                        if (callback && typeof (callback) === "function") {

                            callback(
                                { message: 'Version ' + config.version + config.mustUpdateText }
                            );
                            $(".header .btn").hide();
                        }
                        return;

                    } else {
                        webServices.getEndpoints(function (eData) {
                            if (eData) {
                                // The endpoints are loaded
                                // Send to the right UI -- 
                                thisObject.next();
                            }
                            else {
                                // The endpoints are not loaded - Stop right there - Run offline?
                                if (callback && typeof (callback) === "function") {
                                    callback({ message: 'Could not connect to the online services.' });
                                }
                            }
                        });
                    }
                }
                else {
                    checkConnection();

                    if (dataCache.dictionary.get(window.app.culture)) {
                        if (!window.app.isOnline) {
                            thisObject.next();
                            return;
                        }
                    }
                    
                    if (callback && typeof (callback) === "function") {
                        callback({ message: 'Could not connect to the online services.' });
                    }                    
                }
            });

            // callback(window.tempData.getStartedImages);
        }
    },
    screenTitle: function () {
        return config.loadingText;
    },
    next: function () {
        // this._super();
        var profiles = ProfileDal.listAllProfiles();
        $('#defaultContent').show();

        if (profiles.length > 0) {
            // If there is a profile, Welcome / Login -- 
            this.nextScreen().welcome.show();
        } else {
            // Else, SplashScreenView -- 
            this.nextScreen().splash.show();
        }
    }
});