/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../libs/dirty-form.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

/*   
* Definition of the View class
*/
var View = Class.extend({
    containerId: '',
    templateId: '',
    model: null,
    // nextScreen: null,
    init: function (containerId, templateId) {
        this.containerId = containerId;
        this.templateId = templateId;

        this.timer = new Date();
    },
    setModel: function (model) {
        this.model = model;
    },
    getModel: function () {
        return this.model;
    },
    compile: function () {
        //var source = $("#" + this.templateId).html();
        this.compiledTemplate = Handlebars.templates[this.templateId];// Handlebars.template();// Handlebars.compile(source);
    },
    preparse: function () {
        if (!this.compiledTemplate) {
            this.compile();
        }
    },
    compiledTemplate: null,
    getTemplatedContent: function (data, dictionary, model, appData, uiData, assocData, alerts) {

        if (!this.compiledTemplate) {
            this.compile();
        }
        var template = this.compiledTemplate;

        if (config.debug) { console.log('Template parsing start: ' + (new Date() - this.timer)); }

        var profile = null;
        var isInProfileWizard = false;
        if (window.app) {
            profile = window.app.currentProfile;
            isInProfileWizard = window.app.isInProfileWizard;
        }

        var hasUnreadAlerts = false;
        var nbUnreadAlerts = 0;

        if (window.app) {
            hasUnreadAlerts = alertRead.nbOfUreadAlerts() > 0;
            nbUnreadAlerts = alertRead.nbOfUreadAlerts();
        }

        var html = template({
            containerId: this.containerId,
            data: data,
            dictionary: dictionary,
            profile: profile,
            model: this.model,
            appData: appData,
            uiData: uiData,
            assocData: assocData,
            hasBackButton: this.hasBackButton,
            screenTitle: this.screenTitle,
            alerts: alerts,
            hasUnreadAlerts: hasUnreadAlerts,
            nbUnreadAlerts: nbUnreadAlerts,
            mobileApp: { isInProfileWizard: isInProfileWizard },
            footer: {
                home: this.footerMenuHome,
                alerts: this.footerMenuAlerts,
                support: this.footerMenuSupport,
                profile: this.footerMenuProfile,
                more: this.footerMenuMore
            }
        });

        if (config.debug) { console.log('Template parsing stop: ' + (new Date() - this.timer)); }

        return html;
    },
    localData: null,
    getData: function (callback) {
        // must be overriden in child classes
    },
    hasBackButton: function () {
        return false;
    },
    backText: function () {
        if (dataCache.dictionary.get(window.app.culture)) {
            return dataCache.dictionary.get(window.app.culture).Common_Back;
        }
        
        return '<';
    },
    back: function () { },
    logout: function () {
        if (this.isWatchedFormDirty()) {
            showConfirm(dataCache.dictionary.get(window.app.culture).Common_Logout_Dirty_Form, function () {
                window.app.screens.mainMenu.executeLogout(true);
            });
        }
        else if (app.isInClaimEdit)
        {
            showConfirm(dataCache.dictionary.get(window.app.culture).Claim_LogoutDirtyForm, function () {
                window.app.screens.mainMenu.executeLogout(true);
            });
        }
        else {
            window.app.screens.mainMenu.logout();
        }
    },
    screenTitle: function () {
        if (window.app.currentProfile && dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId)) {
            return dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId).appTitleName;
        }

        if (dataCache.dictionary.get(window.app.culture)) {
            return dataCache.dictionary.get(window.app.culture).Common_Title;
        }

        return '';
    },
    successLoading: false,
    loadDictionary: function (dicData) {
        if (config.debug) { console.log('Load Dictionary: ' + (new Date() - window.app.currentScreen.timer)); }
        webServices.getApplicationData(window.app.currentScreen.loadApplicationData);
    },
    loadApplicationData: function (appData) {
        if (config.debug) { console.log('Load Application Data: ' + (new Date() - window.app.currentScreen.timer)); }
        webServices.getUiContents(window.app.currentScreen.loadUiContent);
    },
    loadUiContent: function (uiD) {
        if (config.debug) { console.log('Load UI Content: ' + (new Date() - window.app.currentScreen.timer)); }

        var thisObject = window.app.currentScreen;
        var dicData = dataCache.dictionary.get(window.app.culture);
        var appData = dataCache.applicationData.get(window.app.culture);
        var uiData = dataCache.uiContentsData.get(window.app.culture);

        if ((webServices.initialized) || !webServices.initialized) {
            if (config.debug) { console.log('Load next screen GetData: ' + (new Date() - window.app.currentScreen.timer)); }
            thisObject.getData(function (data) {
                thisObject.localData = data;
                if (window.app.currentProfile) {
                    webServices.getAlerts(window.app.currentProfile.associationId, thisObject.loadAlerts);
                } else {
                    thisObject.noProfileShow();
                }
            });
        } else {
            thisObject.successLoading = false;
            if (config.debug) {
                console.log('Missing data');
                console.log(dicData);
                console.log(appData);
                console.log(uiData);
            }
            hideLoading();
        }
    },
    noProfileShow: function () {
        // if (config.debug) { console.log('No Profile Show: ' + (new Date() - window.app.currentScreen.timer)); }

        var thisObject = window.app.currentScreen;
        var dicData = dataCache.dictionary.get(window.app.culture);
        var appData = dataCache.applicationData.get(window.app.culture);
        var uiData = dataCache.uiContentsData.get(window.app.culture);

        // Shows the screen
        $('#' + thisObject.containerId).remove();
        $('body').append(thisObject.getTemplatedContent(thisObject.localData, dicData, thisObject.getModel(), appData, uiData, null, null));

        // After show()
        thisObject.successLoading = true;
        $('section').css('height', getHeight() + 'px');
        $('section').css('width', getWidth() + 'px');
        //$('section').css('height', window.innerHeight + 'px');
        thisObject.afterShow();

        var formB = thisObject.watchedForm();
        if (formB && formB.length) { $(formB).dirtyForm(); }

        // Hide the current screen
        $('.horizontal:visible').hide();
        $('.screen:visible').hide();

        // Show the screen
        $('#' + thisObject.containerId).show();

        // if (config.debug) { console.log('time:' + (new Date() - thisObject.timer)); }

        hideLoading();
    },

    loadAlerts: function (alertData) {
        if (config.debug) { console.log('Load alerts: ' + (new Date() - window.app.currentScreen.timer)); }
        webServices.getAssociationData(window.app.currentProfile.associationId, window.app.currentScreen.profileShow);
    },
    profileShow: function (associationData) {
        if (config.debug) { console.log('Profile Show: ' + (new Date() - window.app.currentScreen.timer)); }

        var thisObject = window.app.currentScreen;
        var dicData = dataCache.dictionary.get(window.app.culture);
        var appData = dataCache.applicationData.get(window.app.culture);
        var uiData = dataCache.uiContentsData.get(window.app.culture);
        var assocData = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId);
        var alerts = dataCache.alerts.get(window.app.culture);
        
        // Loads the screen
        $('#' + thisObject.containerId).remove();
        $('body').append(thisObject.getTemplatedContent(thisObject.localData, dicData, thisObject.getModel(), appData, uiData, assocData, alerts));

        // After show()
        thisObject.successLoading = thisObject;
        $('section').css('height', getHeight() + 'px');
        $('section').css('width', getWidth() + 'px');
        //$('section').css('height', window.innerHeight + 'px');
        thisObject.afterShow();

        var formA = thisObject.watchedForm();
        if (formA && formA.length) { $(formA).dirtyForm(); }

        // Hide the current screen
        $('.horizontal:visible').hide();
        $('.screen:visible').hide();

        // Show the screen
        $('#' + thisObject.containerId).show();

        // if (config.debug) { console.log('time:' + (new Date() - thisObject.timer)); }

        hideLoading();
    },
    timer: null,
    show: function () {        
        if (config.debug) { console.log('Show BasicView'); }
        //$(document).scrollTop(0);
        $('.main').scrollTop(0);
        this.timer = new Date();

        showLoading();
        window.app.isInProfileEdit = false;
        window.app.isInClaimEdit = false;

        // var thisObject = this;
        window.app.previousScreen = window.app.currentScreen;
        window.app.currentScreen = this;

        // if (config.debug) { console.log('time:' + (new Date() - this.timer)); }
        webServices.getDictionary(window.app.culture, this.loadDictionary);
    },
    hide: function () {
        this.setModel(null);
        if (this.containerId) {
            $('#' + this.containerId).hide();
        }
        else {
            $('.screen:visible').hide();
        }

        var formC = this.watchedForm();
        if (formC && formC.length) { $(formC).dirtyForm('destroy'); }
    },
    next: function () {
        this.hide();
    },
    afterShow: function () {
        var backText = window.app.currentScreen.backText();
        $('#' + this.containerId + ' #headerPreviousPlaceHolder').html(backText);

        if (config.debug) { console.log('After Show: ' + (new Date() - window.app.currentScreen.timer)); }
        if (webServices.initialized) {
            $('#defaultContent').hide();
        }
        checkHideStatusBar();
    },
    filterAssociations: function (provinceId) {
        var assocData = dataCache.provinceAssociations.get(window.app.culture);

        return JSLINQ(assocData)
            .Where(function (item) { return item.provinceId == provinceId; })
            .Select(function (item) { return item.associations; }).items[0];
    },
    getAssociation: function (associationId) {
        var assocData = dataCache.associations.get(window.app.culture);
        return JSLINQ(assocData)
            .Where(function (item) { return item.id == associationId; })
            .items[0];
    },
    watchedForm: function () { return []; },
    isWatchedFormDirty: function () {
        var theWatchedForm = this.watchedForm();

        if (theWatchedForm.length == 0) {
            return false;
        } else {
            return theWatchedForm.dirtyForm('isDirty');
        }
    },
    alertIfWatchedFormIsDirty: function (callback) {
        if (!this.isWatchedFormDirty())
            callback();
        else {
            showConfirm(dataCache.dictionary.get(window.app.culture).Common_Quite_Dirty_Form, function () {
                callback();
            });
        }
    },
    footerMenuClick: function (callback) {
        

        if (window.app.isInProfileEdit || window.app.isInProfileWizard) {
            this.alertIfWatchedFormIsDirty(callback);
        }
        else if (window.app.isInClaimEdit) {
            showConfirm(dataCache.dictionary.get(window.app.culture).Claim_CancelClaim, callback);
        }
        else {
            callback();
        }
    },
    footerMenuHome: false,
    footerMenuAlerts: false,
    footerMenuSupport: false,
    footerMenuProfile: false,
    footerMenuMore: false
});
