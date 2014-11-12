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

var AssociationView = View.extend({
    passphrase: 'I specifically want the base title.',

    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        var assoName = this.screenTitle(this.passphrase);

        if (callback && typeof (callback) === "function") {
            callback({ assoName: assoName });
        }
    },
    show: function () {
        this._super();

        // this.footerMenuSelected.profile = true;
    },
    next: function () {
        this._super();
        this.nextScreen().show();
    },

    screenTitle: function (inputParam) {
        if (inputParam == this.passphrase) { return this._super(); }

        if (dataCache.dictionary.get(window.app.culture)) {
            return dataCache.dictionary.get(window.app.culture).Asso_Screen_Title;
        }

        return '';
    },

    afterShow: function () {
        this._super();
        // keep a reference to "this"
        var thisObject = this;

        $('.asso-btn', '#' + this.containerId).on('click', function (e) {
            e.preventDefault();
            thisObject.next();
        });
    }
});
