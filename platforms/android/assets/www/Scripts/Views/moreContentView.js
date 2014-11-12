/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var MoreContentView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },

    afterShow: function () {
        this._super();
        // keep a reference to "this"
        var thisObject = this;

        $('.question', '#' + this.containerId).on('click', function () {
            var questionElement = $(this);
            questionElement.siblings('.answer').slideToggle(300, function () {
                questionElement.parent().toggleClass('expanded');
            });
        });
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).More_TopTitle;
    },
    footerMenuMore: true,
    next: function () {
        this._super();
        this.nextScreen().show();
    },

    hasBackButton: function () { return true; },
    back: function () { window.app.screens.more.show(); }
});
