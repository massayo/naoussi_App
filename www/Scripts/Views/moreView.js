/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var MoreView = View.extend({
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

        $('.more-btn-view', '#' + this.containerId).on('click', function () {
            var clickedMoreContentNavId = $(this).attr('data-navid');
            thisObject.next(clickedMoreContentNavId);
        });
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).More_TopTitle;
    },
    footerMenuMore: true,
    next: function (navid) {
        this._super();
        var items = JSLINQ(dataCache.applicationData.get(window.app.culture).staticPages)
            .Where(function (item) { return item.navId == navid; })
            .items;
        var model = (items && items.length > 0) ? items[0] : null;

        // Check Insurer Static Pages
        if (!model)
        {
            items = JSLINQ(dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId).insurerStaticPages)
            .Where(function (item) { return item.navId == navid; })
            .items;
            model = (items && items.length > 0) ? items[0] : null;
        }

        this.nextScreen().setModel(model);
        this.nextScreen().show();
    }
});
