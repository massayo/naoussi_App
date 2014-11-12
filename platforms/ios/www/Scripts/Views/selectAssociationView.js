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
var SelectAssociationView = View.extend({
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
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).Profile_CreateProcess_Title;
    },
    afterShow: function () {
        this._super();

        var associationId = window.localStorage.getItem("Selected.AssociationId");
        var cultureCode = window.localStorage.getItem("Selected.PreferredLanguage");

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

                var selectedAssociation = $("#" + thisObject.containerId + " #association").children("option:selected").val();
                window.localStorage.setItem("Selected.AssociationId", selectedAssociation);

                // If can choose another language, otherwise keep the association default
                if ($("#" + thisObject.containerId + ' #preferredLanguage-container').is(":visible")) {
                    window.localStorage.setItem("Selected.PreferredLanguage", $("#" + thisObject.containerId + " #preferredLanguage").val());
                }

                window.app.culture = window.localStorage.getItem("Selected.PreferredLanguage");
                thisObject.nextScreen().show();
            }
        });
    },

    next: function () {
        this._super();
        this.nextScreen().show();
    },

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
                    window.localStorage.setItem("Selected.PreferredLanguage", 'en-CA');
                }
                if (association.french) {
                    window.localStorage.setItem("Selected.PreferredLanguage", 'fr-CA');
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