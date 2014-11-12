/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

/*   
* Definition of the Create Profile View
*/
var EditSelectAssociationView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        var thisObject = this;

        webServices.getAssociations(function (assocData) {
            if (callback && typeof (callback) === "function") {
                assocData.splice(0, 0, { id: '', name: dataCache.dictionary.get(window.app.culture).SelectAssoc_EmptyAssociation });
                callback({
                    associations: assocData
                });

                thisObject.refreshPreferredLanguageContainer();
            }
        });
    },

    watchedForm: function () { return $('#selectAssociationForm', '#' + this.containerId); },

    afterShow: function () {
        this._super();
        window.app.isInProfileEdit = true;

        var associationId = window.app.currentProfile.associationId;
        if (window.app.currentProfile.oldAssociationId) {
            associationId = window.app.currentProfile.oldAssociationId;
        }

        var cultureCode = window.app.currentProfile.cultureCode;
        if (window.app.currentProfile.oldCultureCode) {
            cultureCode = window.app.currentProfile.oldCultureCode;
        }

        if (associationId) {
            $("#" + this.containerId + " #association").val(associationId);
            this.refreshPreferredLanguageContainer();
        }

        if (cultureCode) {
            $("#" + this.containerId + ' #preferredLanguage').val(cultureCode);
        }

        var thisObject = this;
        $("#" + this.containerId + ' #selectAssociationForm').validate({
            rules: {
                association: { required: true }
            },
            submitHandler: function (form) {
                event.preventDefault();

                // If can choose another language, otherwise keep the association default
                var selectedCulture = $("#" + thisObject.containerId + " #preferredLanguage").val();
                var selectedAssociation = $("#" + thisObject.containerId + " #association").children("option:selected").val();

                if (config.debug) {
                    console.log(selectedCulture);
                    console.log(selectedAssociation);
                }

                if (selectedAssociation != associationId) {
                    showConfirm(dataCache.dictionary.get(window.app.culture).Profile_SelectAssoc_ChangeConfirm, function () {
                        window.app.currentProfile.oldAssociationId = associationId;
                        window.app.currentProfile.associationId = selectedAssociation;

                        window.app.currentProfile.oldCultureCode = cultureCode;
                        window.app.currentProfile.cultureCode = selectedCulture;
                        window.app.culture = selectedCulture;

                        window.app.screens.basicInformation.show();
                    });
                }
                else if (selectedCulture != cultureCode) {
                    window.app.currentProfile.oldCultureCode = cultureCode;
                    window.app.currentProfile.cultureCode = selectedCulture;
                    window.app.culture = selectedCulture;

                    var profile = ProfileDal.getProfile(window.app.currentProfile.id);
                    profile.cultureCode = window.app.currentProfile.cultureCode;
                    profile.brand = config.brand;

                    if (window.app.currentProfile && window.app.isOnline) {
                        var oldStudentId = window.app.currentProfile.studentId;
                        var oldEmail = window.app.currentProfile.email;
                        if (config.debug) { console.log(oldStudentId); }

                        profile.password = '';

                        // Update online
                        webServices.updateProfile(oldStudentId, oldEmail, profile, function (data) {
                            profile = ProfileDal.importOnlineObject(profile, data);

                            ProfileDal.saveProfile(profile.id, profile);
                            window.app.currentProfile = profile;
                            window.app.culture = profile.cultureCode;

                            window.app.screens.profile.show();
                        });
                    }
                    
                } else {
                    window.app.screens.profile.show();
                }
            }
        });
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

    // Show preferred language if association is bilingual
    refreshPreferredLanguageContainer: function () {
        var associationSelect = $("#" + this.containerId + " #association");
        var assocationsCount = $(associationSelect).children("option").size();

        if (assocationsCount > 0) {
            // Get selected association and check if bilingual
            var selectedAssociation = $(associationSelect).children("option:selected").val();
            var association = this.getAssociation(selectedAssociation);

            if (association) {
                if (association.english && association.french) {
                    this.showLanguagesChoices();
                    return;
                }

                if (association.english) {
                    $("#" + this.containerId + " #preferredLanguage").val('en-CA');
                }
                if (association.french) {
                    $("#" + this.containerId + " #preferredLanguage").val('fr-CA');
                }
            }
        }

        this.hideLanguageChoices();
    },

    showLanguagesChoices: function () {
        var langContainer = $("#" + this.containerId + ' #preferredLanguage-container');

        $(langContainer).show();
    },

    hideLanguageChoices: function () {
        var langContainer = $("#" + this.containerId + ' #preferredLanguage-container');

        $(langContainer).hide();
    }
});