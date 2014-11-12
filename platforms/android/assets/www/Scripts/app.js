/// <reference path="libs/jquery-1.7.2.js" />
/// <reference path="libs/handlebars.js" />
/// <reference path="libs/base.js" />
/// <reference path="libs/JSLINQ.js" />
/// <reference path="webServices.js" />
/// <reference path="main.js" />
/// <reference path="../config.js" />
/// <reference path="Models/profile.js" />
/// <reference path="Views/loadingApplicationView.js" />
/// <reference path="Views/alertView.js" />
/// <reference path="Views/associationView.js" />
/// <reference path="Views/basicInformationView.js" />
/// <reference path="Views/benefitDetailView.js" />
/// <reference path="Views/benefitListView.js" />
/// <reference path="Views/claimHistoryView.js" />
/// <reference path="Views/claimWizard.js" />
/// <reference path="Views/contactInformationView.js" />
/// <reference path="Views/coordinationBenefitFormView.js" />
/// <reference path="Views/coordinationBenefitListView.js" />
/// <reference path="Views/createProfileView.js" />
/// <reference path="Views/createProfileConfirmationView.js" />
/// <reference path="Views/dependentFormView.js" />
/// <reference path="Views/dependentListView.js" />
/// <reference path="Views/dependentSplashView.js" />
/// <reference path="Views/editProfileView.js" />
/// <reference path="Views/editSelectAssociationView.js" />
/// <reference path="Views/firstWelcomeView.js" />
/// <reference path="Views/forgotPasswordView.js" />
/// <reference path="Views/getStartedView.js" />
/// <reference path="Views/loadingApplicationView.js" />
/// <reference path="Views/mainMenuView.js" />
/// <reference path="Views/moreView.js" />
/// <reference path="Views/moreContentView.js" />
/// <reference path="Views/payDirectCardView.js" />
/// <reference path="Views/payDirectCardIntroView.js" />
/// <reference path="Views/profileView.js" />
/// <reference path="Views/RefundPreferencesView.js" />
/// <reference path="Views/securitySettingsView.js" />
/// <reference path="Views/selectAssociationView.js" />
/// <reference path="Views/settingsView.js" />
/// <reference path="Views/splashScreenView.js" />
/// <reference path="Views/startProfileWizardView.js" />
/// <reference path="Views/supportView.js" />
/// <reference path="Views/travelEmergencyView.js" />
/// <reference path="Views/welcomeView.js" />

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var generalErrorView = ({
    show: function () {
        alert('Une erreur est survenue - An error happened');
        // $('#generalErrorHandler').show();
        // hideLoading();
    },
    hide: function () {
        // $('#generalErrorHandler').hide();
    }
});

var errorView = ({
    show: function (errorObj) {
        if (errorObj) {
            showAlert(errorObj.message);
        }
        hideLoading();
    },
    hide: function () {
        // $('#errorHandler').hide();
    }
});



/*
* Definition of the core application component
*/
window.app = {
    isInProfileWizard: false,
    isInProfileEdit: false,
    isInClaimEdit: false,
    isOnline: true,
    culture: config.defaultCultureCode,
    currentProfile: null,
    previousScreen: null,
    isLoading: false,
    currentScreen: null,
    currentProfileEditState: {
        isCreatingProfile: false,
        isEditingProfile: false,
        editProfileId: null
    },
    forceReloadClaimHistory: false,
    listSavedProfiles: function () {
        // return list of profiles
    },
    saveProfile: function (profile) {
        // add or update profile
        if (profile) {

        }
    },
    deleteProfile: function (profileId) {
        // delete a profile
        if (profileId) {

        }
    },
    initialize: function () {
        if (config.debug) { console.log('initialize'); }

        $('section').css('height', $(window).height() + 'px');
        $('section').css('width', $(window).width() + 'px');

        Handlebars.registerPartial("header", Handlebars.templates["Header.html"]);
        Handlebars.registerPartial("footer", Handlebars.templates["Footer.html"]);

        var i = 0;
        for (i in this.screens) {
            if (this.screens[i]) {
                if (config.debug) { console.log("Preparse: " + this.screens[i].containerId); }
                this.screens[i].preparse();
            }
        }

        $('#defaultContent').hide();
        this.screens.loadingApplication.show();
    },
    screens: {
        loadingApplication: new LoadingApplicationView('loadingApplicationContainer', 'LoadingApplication.html', function () { return { splash: app.screens.splashScreen, welcome: app.screens.welcome, mainMenu: app.screens.mainMenu }; }),
        getStarted: new GetStartedView('getStartedContainer', 'GetStarted.html', function () { return app.screens.welcome; }),
        selectAssociation: new SelectAssociationView('selectAssociationContainer', 'SelectAssociation.html', function () { return app.screens.createProfile; }),
        // firstWelcome: new FirstWelcomeView('firstWelcomeContainer', 'FirstWelcome.html', function () { return app.screens.editProfile; }),
        // associationLanguage: null,
        welcome: new WelcomeView('welcomeContainer', 'Welcome.html', function () { return { next: app.screens.association, back: app.screens.splashScreen }; }),
        association: new AssociationView('associationContainer', 'Association.html', function () { return app.screens.mainMenu; }),
        mainMenu: new MainMenuView('mainMenuContainer', 'MainMenu.html', function () {
            return { welcome: app.screens.welcome,
                benefit: app.screens.benefitList,
                claim: app.screens.claimWizard,
                pay: app.screens.payDirectCardIntro,
                home: app.screens.mainMenu,
                alerts: app.screens.alerts,
                support: app.screens.support,
                profile: app.screens.profile,
                more: app.screens.more,
                claimHistory: app.screens.claimHistory,
                travel: app.screens.travelEmergency
            };
        }),
        createProfile: new CreateProfileView('createProfileContainer', 'CreateProfile.html', function () { return { settings: app.screens.settings, dependentSplash: app.screens.dependentSplash }; }),
        //editProfile: new EditProfileView('editProfileContainer', 'EditProfile.html', function () { return { settings: app.screens.settings, dependentSplash: app.screens.dependentSplash }; }),
        lock: null,
        claimWizard: new ClaimWizardView('claimWizardContainer', 'ClaimWizard.html', function () { return null; }),
        benefitList: new BenefitListView('benefitListContainer', 'BenefitList.html', function () { return { benefitDetail: app.screens.benefitDetail, back: app.screens.mainMenu }; }),
        benefitDetail: new BenefitDetailView('benefitDetailContainer', 'BenefitDetail.html', function () { return { benfitList: app.screens.benefitList, back: app.screens.benefitList }; }),
        payDirectCard: new PayDirectCardView('payDirectCardContainer', 'PayDirectCard.html', function () { return null; }),
        payDirectCardIntro: new PayDirectCardIntroView('payDirectCardIntroContainer', 'PayDirectCardIntro.html', function () { return app.screens.payDirectCard; }),
        support: new SupportView('supportContainer', 'Support.html', function () { return app.screens.mainMenu; }),
        settings: new SettingsView('settingsContainer', 'Settings.html', function () { return { editProfile: app.screens.editProfile, editDependents: app.screens.dependentList, claimsHistory: null }; }),
        dependentSplash: new DependentSplash('dependentSplashContainer', 'DependentSplash.html', function () { return { addDependent: app.screens.dependentForm, cancel: app.screens.mainMenu }; }),
        dependentList: new DependentList('dependentListContainer', 'DependentList.html', function () {
            return { addDependent: app.screens.dependentForm,
                modifyDependent: app.screens.dependentForm,
                cancel: app.screens.profile,
                profile: app.screens.profile,
                wizard: app.screens.coordinationBenefitList
            };
        }),
        dependentForm: new DependentForm('dependentFormContainer', 'DependentForm.html', function () { return { submit: app.screens.dependentList, cancel: app.screens.dependentList }; }),
        alerts: new AlertView('alertContainer', 'Alert.html', function () { return app.screens.mainMenu; }),
        forgotPassword: new ForgotPasswordView('forgotPasswordContainer', 'ForgotPassword.html', function () { return app.screens.welcome; }),
        more: new MoreView('moreViewContainer', 'More.html', function () { return app.screens.moreContent; }),
        moreContent: new MoreContentView('moreContentViewContainer', 'MoreContent.html', function () { return app.screens.mainMenu; }),
        profile: new ProfileView('profileViewContainer', 'Profile.html', function () { return app.screens.mainMenu; }),
        basicInformation: new BasicInformationView('basicInformationViewContainer', 'BasicInformation.html', function () { return app.screens.profile; }),
        securitySettings: new SecuritySettingsView('securitySettingsViewContainer', 'SecuritySettings.html', function () { return app.screens.profile; }),
        refundPreferences: new RefundPreferencesView('refundPreferencesViewContainer', 'RefundPreferences.html', function () { return { profile: app.screens.profile, wizard: app.screens.dependentList }; }),
        startProfileWizard: new StartProfileWizardView('startProfileWizardViewContainer', 'StartProfileWizard.html', function () { return { wizard: app.screens.contactInformation }; }),
        contactInformation: new ContactInformationView('contactInformationContainer', 'ContactInformation.html', function () { return { profile: app.screens.profile, wizard: app.screens.refundPreferences }; }),
        coordinationBenefitList: new CoordinationBenefitListView('coordinationBenefitListContainer', 'CoordinationBenefitList.html', function () { return { profile: app.screens.profile, wizard: app.screens.completeProfileEnd }; }),
        coordinationBenefitForm: new CoordinationBenefitFormView('coordinationBenefitFormContainer', 'CoordinationBenefitForm.html', function () { return app.screens.coordinationBenefitList; }),
        completeProfileEnd: new CompleteProfileEndView('completeProfileEndContainer', 'CompleteProfileEnd.html', function () { return app.screens.profile; }),
        claimHistory: new ClaimHistoryView('claimHistoryContainer', 'ClaimHistory.html', function () { return app.screens.mainMenu; }),
        createProfileConfirmation: new CreateProfileConfirmationView('CreateProfileConfirmationContainer', 'CreateProfileConfirmation.html', function () { return app.screens.welcome; }),
        editSelectAssociation: new EditSelectAssociationView('EditSelectAssociationContainer', 'EditSelectAssociation.html', function () { return app.screens.profile; }),
        travelEmergency: new TravelEmergencyView('TravelEmergencyContainer', 'TravelEmergency.html', function () { return app.screens.mainMenu; }),
        splashScreen: new SplashScreenView('splashScreenContainer', 'SplashScreen.html', function () { return { getStarted: app.screens.getStarted, welcome: app.screens.welcome }; })
    }
};
