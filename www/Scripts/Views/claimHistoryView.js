/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />
/// <reference path="../claims.js" />

var ClaimHistoryView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        // Get Completed Claim History
        webServices.getClaimHistory(app.currentProfile, true, function (data) {
            // Get Incompleted Claim History
            Claims.listFailedClaims(function (failedClaims) { 
                var hasSubmittedClaims = data && data.length > 0;
                var hasNotSentClaims = failedClaims && failedClaims.length > 0;
            
                if (callback && typeof (callback) === "function") {
                    callback({
                        claims: data,
                        empty: !hasSubmittedClaims && !hasNotSentClaims,
                        hasSubmittedClaims: hasSubmittedClaims,
                        hasNotSentClaims: hasNotSentClaims,
                        failedClaims: failedClaims
                    });
                }
            });
        });
    },

    next: function (screen) {
        this._super();
        screen.show();
    },

    hasBackButton: function () { return true; },

    back: function () { window.app.screens.mainMenu.show(); },

    afterShow: function () {
        this._super();
        // keep a reference to "this"
        var thisObject = this;

        
        if (window.app.currentProfile && dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId)) {
            var associationData = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId);

            $('span.AssociationCoveragePlan', '#' + this.containerId).each(function () {
                $(this).html(associationData.appTitleName);
            });

            $('span.AssociationPolicyNumber', '#' + this.containerId).each(function () {
                $(this).html(associationData.groupNumber);
            });
        }
        
        $('.claim-pending-a', '#' + this.containerId).on('click', function (e) {
            var position = $(this).attr('data-clickParam');
            e.preventDefault();
            showConfirm(dataCache.dictionary.get(window.app.culture).ClaimHistory_ResendPendingClaim_Confirm_Message, function () {
                thisObject.resendClaim(position);
            });
        });

        $('.claim-delete-a', '#' + this.containerId).on('click', function (e) {
            var position = $(this).attr('data-clickParam');
            e.preventDefault();
            showConfirm(dataCache.dictionary.get(window.app.culture).ClaimHistory_DeletePendingClaim_Confirm_Message, function () {
                thisObject.deleteClaim(position);
            });
        });

        $('.person', '#' + this.containerId).each(function () {
            var dataId = $(this).attr("data-id");
            var name = '';
            if (dataId == 0)
            {
                name = app.currentProfile.firstName;
            }
            else
            {
                if (app.currentProfile.dependents)
                {
                    var dependent = ProfileDal.getDependent(app.currentProfile, dataId);
                    if (dependent)
                    {
                        name = dependent.firstName;
                    }
                }
            }

            $(this).html(name);
        });
    },

    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ClaimHistory_TopTitle;
    },

    resendClaim: function (position) {
        claimWizard.completedImage = "<img src='data:image/jpeg;base64," + dataCache.uiContentsData.get(window.app.culture).Done.presentation + "' />";
        claimWizard.inProgressImage = "<img src='data:image/jpeg;base64," + dataCache.uiContentsData.get(window.app.culture).InProgress.presentation + "' />";
        var thisObject = app.screens.claimHistory;
        Claims.listFailedClaims(function (failedClaims) {
            var claim = failedClaims[position];
            $('#claimHistoryList').hide();
            $('#claimHistoryUploadPage').show();
            thisObject.hideBackButton();
            thisObject.hideLogoutButton();
            Claims.resendFailedClaim(claim, "claimHistoryUploadPage", thisObject.resendSuccess, thisObject.resendFail);
        });
    },

    resendSuccess: function (claim) {
        var thisObject = app.screens.claimHistory;
        showAlert(dataCache.dictionary.get(window.app.culture).Claim_UploadSuccess_Text);
        thisObject.showBackButton();
        thisObject.showLogoutButton();
        $("footer").show();

        Claims.removeFailedClaim(claim.position, function () {
            $('#claimHistoryUploadPage').hide();
            $('#claimHistoryList').show();
            showSpinner();
            webServices.getClaimHistory(app.currentProfile, true, function (data) {
                hideSpinner();
                window.app.screens.claimHistory.show();
            });
        });
    },
    resendFail: function (claim) {
        var thisObject = app.screens.claimHistory;
        thisObject.showBackButton();
        thisObject.showLogoutButton();
        $('#claimHistoryList').show();
        $('#claimHistoryUploadPage').hide();
        $("footer").show();

        showAlert(dataCache.dictionary.get(window.app.culture).Claim_UploadFail_Text);
    },


    showBackButton: function () {
        $('#claimHistoryContainer #headerPreviousPlaceHolder').show();
    },
    showLogoutButton: function () {
        $('#claimHistoryContainer #headerLogoutButton').show();
    },

    hideBackButton: function () {
        $('#claimHistoryContainer #headerPreviousPlaceHolder').hide();
    },
    hideLogoutButton: function () {
        $('#claimHistoryContainer #headerLogoutButton').hide();
    },

    deleteClaim: function (position) {
        Claims.removeFailedClaim(position, function () {
            window.app.screens.claimHistory.show();
        });
    }
});
