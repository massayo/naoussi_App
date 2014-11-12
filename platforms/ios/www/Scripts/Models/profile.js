/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../config.js" />

/* Profile DAL */
var ProfileDal = {
    createProfile: function () {
        return {
            id: 0,
            studentId: '',
            email: '',
            password: '',
            associationId: 0,
            cultureCode: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            address1: '',
            address2: '',
            city: '',
            provinceCode: '',
            postalCode: '',
            phone1: '',
            phone1IsMobile: false,
            phone2: '',
            phone2IsMobile: false,
            receiveMsgOnMobile: false,
            refundType: '',
            bankAccountFirstName: '',
            bankAccountLastName: '',
            bankName: '',
            bankNumber: '',
            bankAccountNumber: '',
            bankTransitNumber: '',
            bankInformationTransferred: true,
            emailValidated: false,
            resetPasswordRequired: false,
            completed: false,
            automaticLogout: true,
            rememberMe: false,
            token: ''
        };
    },
    importFormObject: function (profile, formObject) {
        profile.id = formObject.id;

        if (formObject.association) { profile.associationId = formObject.association; }
        if (formObject.studentId) { profile.studentId = formObject.studentId; }
        if (formObject.email) { profile.email = formObject.email; }
        if (formObject.firstname) { profile.firstName = formObject.firstname; }
        if (formObject.lastname) { profile.lastName = formObject.lastname; }
        if (formObject.birthdate) { profile.dateOfBirth = formObject.birthdate; }
        if (formObject.gender) { profile.gender = formObject.gender; }
        if (formObject.password) { profile.password = formObject.password; }
        if (formObject.newPassword) { profile.password = formObject.newPassword; }
        if (formObject.address1) { profile.address1 = formObject.address1; }
        if (formObject.address2) { profile.address2 = formObject.address2; }
        if (formObject.city) { profile.city = formObject.city; }
        if (formObject.province) { profile.provinceCode = formObject.province; }
        if (formObject.postalCode) { profile.postalCode = formObject.postalCode; }
        if (formObject.phone1) { profile.phone1 = formObject.phone1; }
        if (typeof formObject.phone1IsMobile != 'undefined') { profile.phone1IsMobile = formObject.phone1IsMobile; }
        if (formObject.phone2) { profile.phone2 = formObject.phone2; }
        if (typeof formObject.phone2IsMobile != 'undefined') { profile.phone2IsMobile = formObject.phone2IsMobile; }
        if (typeof formObject.receiveMsgOnMobile != 'undefined') { profile.receiveMsgOnMobile = formObject.receiveMsgOnMobile; }
        if (formObject.refundType) {
            profile.refundType = formObject.refundType;

            if (profile.refundType == 'direct') {
                if (formObject.bankAccountFirstName) { profile.bankAccountFirstName = formObject.bankAccountFirstName; }
                if (formObject.bankAccountLastName) { profile.bankAccountLastName = formObject.bankAccountLastName; }
                if (formObject.bankName) { profile.bankName = formObject.bankName; }
                if (formObject.bankNumber) { profile.bankNumber = formObject.bankNumber; }
                if (formObject.bankAccountNumber) { profile.bankAccountNumber = formObject.bankAccountNumber; }
                if (formObject.bankTransitNumber) { profile.bankTransitNumber = formObject.bankTransitNumber; }
                if (typeof formObject.bankInformationTransferred != 'undefined') { profile.bankInformationTransferred = formObject.bankInformationTransferred; }
            } else {
                profile.bankAccountFirstName = '';
                profile.bankAccountLastName = '';
                profile.bankName = '';
                profile.bankNumber = '';
                profile.bankAccountNumber = '';
                profile.bankTransitNumber = '';
                profile.bankInformationTransferred = true;
            }
        }
        if (formObject.preferredLanguage) { profile.cultureCode = formObject.preferredLanguage; }
        if (typeof formObject.logoutOption != 'undefined') { profile.automaticLogout = formObject.logoutOption; }

        return profile;
    },
    importOnlineObject: function (profile, onlineObject) {
        profile.id = onlineObject.id;
        profile.associationId = onlineObject.associationId;
        profile.studentId = onlineObject.studentId;
        profile.email = onlineObject.email;
        profile.firstName = onlineObject.firstName;
        profile.lastName = onlineObject.lastName;
        profile.dateOfBirth = onlineObject.dateOfBirth.substr(0, 10);
        profile.gender = onlineObject.gender;
        profile.password = onlineObject.password;
        profile.address1 = onlineObject.address1;
        profile.address2 = onlineObject.address2;
        profile.city = onlineObject.city;
        profile.provinceCode = onlineObject.provinceCode;
        profile.postalCode = onlineObject.postalCode;
        profile.phone1 = onlineObject.phone1;
        profile.phone1IsMobile = onlineObject.phone1IsMobile;
        profile.phone2 = onlineObject.phone2;
        profile.phone2IsMobile = onlineObject.phone2IsMobile;
        profile.receiveMsgOnMobile = onlineObject.receiveMsgOnMobile;
        profile.refundType = onlineObject.refundType;
        profile.bankAccountFirstName = onlineObject.bankAccountFirstName;
        profile.bankAccountLastName = onlineObject.bankAccountLastName;
        profile.bankName = onlineObject.bankName;
        profile.bankNumber = onlineObject.bankNumber;
        profile.bankAccountNumber = onlineObject.bankAccountNumber;
        profile.bankTransitNumber = onlineObject.bankTransitNumber;
        profile.bankInformationTransferred = onlineObject.bankInformationTransferred;
        profile.cultureCode = onlineObject.cultureCode;
        profile.emailValidated = onlineObject.emailValidated;
        profile.resetPasswordRequired = onlineObject.resetPasswordRequired;
        profile.completed = onlineObject.completed;
        profile.dependents = onlineObject.dependents;
        profile.insurers = onlineObject.insurers;
        profile.automaticLogout = onlineObject.automaticLogout;
        profile.token = onlineObject.token;
        profile.ackDirectDeposit = onlineObject.ackDirectDeposit;

        // format dates YYYY-MM-DD
        profile.dateOfBirth = formatDate(profile.dateOfBirth);
        if (profile.insurers) {
            for (var i = 0; i < profile.insurers.length; i++) {
                profile.insurers[i].dateOfBirth = formatDate(profile.insurers[i].dateOfBirth);
                if (profile.insurers[i].otherInsurerCoverageFrom) {
                    profile.insurers[i].otherInsurerCoverageFrom = formatDate(profile.insurers[i].otherInsurerCoverageFrom);
                }
                if (profile.insurers[i].otherInsurerCoverageTo) {
                    profile.insurers[i].otherInsurerCoverageTo = formatDate(profile.insurers[i].otherInsurerCoverageTo);
                }
            }
        }
        if (profile.dependents) {
            for (var i = 0; i < profile.dependents.length; i++) {
                profile.dependents[i].dateOfBirth = formatDate(profile.dependents[i].dateOfBirth);
                if (profile.dependents[i].fullTimeStudentFrom) {
                    profile.dependents[i].fullTimeStudentFrom = formatDate(profile.dependents[i].fullTimeStudentFrom);
                }
                if (profile.dependents[i].fullTimeStudentTo) {
                    profile.dependents[i].fullTimeStudentTo = formatDate(profile.dependents[i].fullTimeStudentTo);
                }
                if (profile.dependents[i].functionalImpairmentFrom) {
                    profile.dependents[i].functionalImpairmentFrom = formatDate(profile.dependents[i].functionalImpairmentFrom);
                }
                if (profile.dependents[i].functionalImpairmentTo) {
                    profile.dependents[i].functionalImpairmentTo = formatDate(profile.dependents[i].functionalImpairmentTo);
                }
                if (profile.dependents[i].childMarriedDate) {
                    profile.dependents[i].childMarriedDate = formatDate(profile.dependents[i].childMarriedDate);
                }
                if (profile.dependents[i].childEmployedDate) {
                    profile.dependents[i].childEmployedDate = formatDate(profile.dependents[i].childEmployedDate);
                }
            }
        }

        return profile;
    },
    // Save Profile 
    // profileId: Id of the profile (position in the array)
    // profile: profile object
    saveProfile: function (profileId, profile) {
        var profiles = ProfileDal.listAllProfiles();

        for (var i = 0; i < profiles.length; i++) {
            if (profiles[i].id == profileId) {
                profiles[i] = profile;
            }
        }

        window.localStorage.setItem('Profiles', JSON.stringify(profiles));
    },
    saveNewProfile: function (profile) {
        var profiles = ProfileDal.listAllProfiles();

        profiles[profiles.length] = profile;

        window.localStorage.setItem('Profiles', JSON.stringify(profiles));
    },
    // Get Profile
    // profileId: Id of the profile (position in the array)
    getProfile: function (profileId) {
        var profiles = ProfileDal.listAllProfiles();

        for (var i = 0; i < profiles.length; i++) {
            if (profiles[i].id == profileId) {
                return profiles[i];
            }
        }

        return null;
    },
    getProfileEmail: function (email) {
        var profiles = ProfileDal.listAllProfiles();

        for (var i = 0; i < profiles.length; i++) {
            if (profiles[i].email == email) {
                return profiles[i];
            }
        }

        return null;
    },
    // List All Profiles
    listAllProfiles: function () {
        var profiles = JSON.parse(window.localStorage.getItem('Profiles'));
        return profiles ? profiles : [];
    },
    listAllRememberedProfiles: function () {
        var profiles = ProfileDal.listAllProfiles();
        return JSLINQ(profiles)
                .Where(function (item) { return item.rememberMe; })
                .items;
    },
    // Save Dependent
    saveDependent: function (profile, dependentId, dependent) {
        if (!profile.dependents) {
            profile.dependents = [];
        }
        profile.dependents[dependentId] = dependent;
        ProfileDal.saveProfile(profile.id, profile);
    },
    getDependent: function (profile, dependentId) {
        var items = JSLINQ(ProfileDal.listAllDependents(profile))
            .Where(function (item) { return item.id == dependentId; })
            .items;

        return (items && items.length > 0) ? items[0] : null;
    },
    listAllDependents: function (profile) {
        var dependents = profile.dependents;
        return dependents ? dependents : [];
    },
    getInsurer: function (profile, id) {
        var items = JSLINQ(ProfileDal.listAllInsurers(profile))
            .Where(function (item) { return item.id == id; })
            .items;
        return (items && items.length > 0) ? items[0] : null;
    },
    listAllInsurers: function (profile) {
        var insurers = profile.insurers;
        return (insurers) ? insurers : [];
    },
    parseInsurerForm: function (form) {
        var typeBenefits = [];
        if (form.otherInsurerCoverageTypeBenefit) {
            typeBenefits = $.isArray(form.otherInsurerCoverageTypeBenefit)
                ? form.otherInsurerCoverageTypeBenefit
                : [form.otherInsurerCoverageTypeBenefit];
        }

        var insurer = {
            studentAccountId: window.app.currentProfile.id,
            firstName: form.firstName,
            lastName: form.lastName,
            gender: form.gender,
            dateOfBirth: form.dateOfBirth,
            isStudentPlanOwner: form.isStudentPlanOwner,
            isDFS: form.isDFS,
            otherInsurerName: form.otherInsurerName,
            otherInsurerCoverageFrom: null,
            otherInsurerCoverageTo: null,
            otherInsurerCoverageTypeBenefit: typeBenefits,
            otherInsurerCoverageTypeCoverage: form.otherInsurerCoverageTypeCoverage,
            dfsContractNumber: form.DFSContractNumber,
            dfsCertificateNumber: form.DFSCertificateNumber,
            otherContractNumber: form.otherContractNumber,
            otherEmployerName: form.otherEmployerName
        };

        if (form.id) {
            insurer.id = form.id;
        }

        if (form.otherInsurerCoverageFrom) {
            insurer.otherInsurerCoverageFrom = form.otherInsurerCoverageFrom;
        }

        if (form.otherInsurerCoverageTo) {
            insurer.otherInsurerCoverageTo = form.otherInsurerCoverageTo;
        }

        return insurer;
    },
    getLastLoggedInProfile: function () {
        var lastLoggedIn = window.localStorage.getItem('LastLoggedInProfile');

        if (!lastLoggedIn) {
            return null;
        }

        var profile = JSLINQ(ProfileDal.listAllProfiles()).Where(function (x) { return x.id == lastLoggedIn; }).FirstOrDefault();

        return profile;
    },
    setLastLoggedInProfile: function (profile) {
        window.localStorage.setItem('LastLoggedInProfile', profile.id);
    }
};
