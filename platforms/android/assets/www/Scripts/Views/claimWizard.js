
var ClaimWizardView = View.extend({
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
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).Claim_Create_Title;
    },
    hasBackButton: function () {
        return claimWizard.pages.currentPosition < 6 || claimWizard.showingFailedClaim;
    },
    back: function () {
        if (claimWizard.pages.currentPosition == 0) {
            window.app.screens.mainMenu.show();
        }
        claimWizard.back();
    },
    backText: function () {
        return dataCache.dictionary.get(window.app.culture).Common_Back;
    },
    show: function () {
        claimWizard.reset();

        this._super();
    },
    afterShow: function () {
        this._super();

        window.app.isInClaimEdit = true;        
    },
    logout: function () {
        var thisObject = this;
        showConfirm(dataCache.dictionary.get(window.app.culture).Common_Logout_Claim, function () { thisObject.executeLogout(true); });
    },
    executeLogout: function (/*bool*/isLogoutConfirmed) {
        if (!isLogoutConfirmed) return;
        window.app.isInProfileWizard = false;
        window.app.currentProfile = null;
        window.app.screens.welcome.show();
    }
});

