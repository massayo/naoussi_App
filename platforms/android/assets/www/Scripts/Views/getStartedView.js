/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/jquery.touchSwipe.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

/*   
* Definition of the GetStarted View
*/
var GetStartedView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
//        var getStartedShown = window.localStorage.getItem("GetStarted.WasShown");
//        if (getStartedShown) {
//            app.screens.getStarted.next();
//        }
//        else {
            webServices.getStartedImages(function (getStartedImagesData) {
                if (callback && typeof (callback) === "function") {
                    callback(getStartedImagesData);
                }
            });
//        }
    },
    next: function () {
        this._super();
        window.localStorage.setItem("GetStarted.WasShown", true);
        this.nextScreen().show();

    },
    afterShow: function () {       

        // Devrait suffire pour déclencher les swippes - B.F. 
        $("#getStartedCarousel img").swipe({
            swipe: function (event, direction, distance, duration, fingerCount) {
                if (direction == 'left')
                {
                    $("#getStartedCarousel").carousel('next'); 
                }

                if (direction == 'right')
                {
                    $("#getStartedCarousel").carousel('prev');
                }

                if (config.debug) {
                    console.log("You swiped " + direction + " with " + fingerCount + " fingers");
                }
            }
        });
    }
});