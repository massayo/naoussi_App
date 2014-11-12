/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var DependentForm = View.extend({
    currentDependent: null,

    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },

    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },

    updateFullTimeStudentDates: function (/*bool?*/isFullTimeStudent) {
        if (!!isFullTimeStudent) { // double ! is to make sure undefined becomes false
            $('#dependentForm_FullTimeStudentDates', '#' + this.containerId).show();
            $('#dependentForm_FullTimeStudentFrom', '#' + this.containerId).addClass('required');
            $('#dependentForm_FullTimeStudentTo', '#' + this.containerId).addClass('required');
        } else {
            $('#dependentForm_FullTimeStudentDates', '#' + this.containerId).hide();
            $('#dependentForm_FullTimeStudentFrom', '#' + this.containerId).removeClass('required');
            //$('#dependentForm_FullTimeStudentFrom', '#' + this.containerId).val('');
            $('#dependentForm_FullTimeStudentTo', '#' + this.containerId).removeClass('required');
            //$('#dependentForm_FullTimeStudentTo', '#' + this.containerId).val('');
        }
    },

    updateFunctionalImpairmentType: function (/*bool?*/hasFunctionalImpairment) {
        if (!!hasFunctionalImpairment) { // double ! is to make sure undefined becomes false
            $('#dependentForm_FunctionalImpairmentType', '#' + this.containerId).show();
            $('#dependentForm_FunctionalImpairment_Info', '#' + this.containerId).show();
            $('#yesFunctionalImpairmentPermanent', '#' + this.containerId).addClass('required');
        } else {
            $('#dependentForm_FunctionalImpairmentType', '#' + this.containerId).hide();
            $('#dependentForm_FunctionalImpairment_Info', '#' + this.containerId).hide();
            $('#yesFunctionalImpairmentPermanent', '#' + this.containerId).removeClass('required');
            $('#dependentForm_FunctionalImpairmentType :radio', '#' + this.containerId).removeAttr('checked');

            $('#dependentForm_FunctionalImpairmentDates', '#' + this.containerId).hide();
            $('#dependentForm_FunctionalImpairmentFrom', '#' + this.containerId).removeClass('required');
            //$('#dependentForm_FunctionalImpairmentFrom', '#' + this.containerId).val('');
            //$('#dependentForm_FunctionalImpairmentTo', '#' + this.containerId).val('');
        }
    },

    updateFunctionalImpairmentDates: function (/*bool?*/isFunctionalImpairmentTemporary) {
        if (!!isFunctionalImpairmentTemporary) { // double ! is to make sure undefined becomes false
            $('#dependentForm_FunctionalImpairmentDates', '#' + this.containerId).show();
            $('#dependentForm_FunctionalImpairmentFrom', '#' + this.containerId).addClass('required');
        } else {
            $('#dependentForm_FunctionalImpairmentDates', '#' + this.containerId).hide();
            $('#dependentForm_FunctionalImpairmentFrom', '#' + this.containerId).removeClass('required');
            //$('#dependentForm_FunctionalImpairmentFrom', '#' + this.containerId).val('');
            //$('#dependentForm_FunctionalImpairmentTo', '#' + this.containerId).val('');
        }
    },

    updateChildOver18Fields: function () {
        var relationshipChildNavId = dataCache.dictionary.get(window.app.culture).RelationshipChildNavId;
        $('#dependentForm_Child18Questions', '#' + this.containerId).hide();

        if (relationshipChildNavId == $('#dependentForm_Relationship', '#' + this.containerId).val()) {
            var value = $('#dependentForm_BirthDate', '#' + this.containerId).val();
            if (value) {
                var dateOfBirth = parseDate(formatDate(value));
                var now = new Date();
                var max18Date = now.setYear(now.getYear() - 18);
                if (dateOfBirth <= max18Date) {
                    if (config.debug) { console.log('18 or older'); }

                    $('#dependentForm_Child18Questions', '#' + this.containerId).show();
                }
            }
        }
    },
    updateChildMarriedDate: function () {
        $('#dependentForm_childMarriedDate', '#' + this.containerId).hide();
        $('#childMarriedDate', '#' + this.containerId).removeClass('required');
        if ($('#yesChildMarried', '#' + this.containerId).is(':checked')) {
            $('#dependentForm_childMarriedDate', '#' + this.containerId).show();
            $('#childMarriedDate', '#' + this.containerId).addClass('required');
        }
    },
    updateChildEmployedDate: function () {
        $('#dependentForm_childEmployedDate', '#' + this.containerId).hide();
        $('#childEmployedDate', '#' + this.containerId).removeClass('required');
        if ($('#yesChildEmployed', '#' + this.containerId).is(':checked')) {
            $('#dependentForm_childEmployedDate', '#' + this.containerId).show();
            $('#childEmployedDate', '#' + this.containerId).addClass('required');
        }
    },

    afterShow: function () {
        this._super();
        window.app.isInProfileEdit = true;

        // keep a reference to "this"
        var thisObject = this;

        var isFullTimeStudent = false;
        thisObject.updateFullTimeStudentDates();
        var hasFunctionalImpairment = false;
        var isFunctionalImpairmentTemporary = false;
        thisObject.updateFunctionalImpairmentType();
        thisObject.updateFunctionalImpairmentDates();

        var model = this.getModel();
        if (model) {
            // Select relationship
            $('#dependentForm_Relationship', '#' + this.containerId).val(model.relationship);

            // Select the dependent's gender
            if (typeof model.gender !== 'undefined' && model.gender != '') {
                $("#" + this.containerId + " #gender").val(model.gender);
            }

            // Select the right relationship option
            $('#dependentForm_Relationship option', '#' + this.containerId).removeAttr('selected');
            if (typeof model.relationshipNavId !== 'undefined') {
                $('#dependentForm_Relationship', '#' + this.containerId).val(model.relationshipNavId);
            }

            // Select whether the dependent is a full time student or not
            $('#dependentForm_FullTimeStudent :radio', '#' + this.containerId).removeAttr('checked');
            if (typeof model.isFullTimeStudent !== 'undefined')
                $('#dependentForm_FullTimeStudent #' + (model.isFullTimeStudent ? "yesFullTimeStudent" : "noFullTimeStudent"), '#' + this.containerId).attr('checked', 'checked');
            // Show / hide the "From - To" section accordingly
            thisObject.updateFullTimeStudentDates(model.isFullTimeStudent);

            // Select whether the dependent has a functional impairment or not
            $('#dependentForm_FunctionalImpairment :radio', '#' + this.containerId).removeAttr('checked');
            if (typeof model.hasFunctionalImpairment !== 'undefined')
                $('#dependentForm_FunctionalImpairment #' + (model.hasFunctionalImpairment ? "yesFunctionalImpairment" : "noFunctionalImpairment"), '#' + this.containerId).attr('checked', 'checked');
            // Show / hide the "Permanent - Temporary" section accordingly
            thisObject.updateFunctionalImpairmentType(model.hasFunctionalImpairment);

            // Select whether the dependent has a temporary functional impairment or a permanent one
            $('#dependentForm_FunctionalImpairmentType :radio', '#' + this.containerId).removeAttr('checked');
            if (typeof model.isFunctionalImpairmentPermanent !== 'undefined') {
                if (model.isFunctionalImpairmentPermanent !== null) {
                    $('#dependentForm_FunctionalImpairmentType #' + (model.isFunctionalImpairmentPermanent ? "yesFunctionalImpairmentPermanent" : "noFunctionalImpairmentPermanent"), '#' + this.containerId).attr('checked', 'checked');
                }
            }
            // Show / hide the "From - To" section accordingly
            isFunctionalImpairmentTemporary = $('#noFunctionalImpairmentPermanent', '#' + this.containerId).is(':checked');
            thisObject.updateFunctionalImpairmentDates(isFunctionalImpairmentTemporary && model.hasFunctionalImpairment);

            if (typeof model.isChildMarried !== 'undefined') {
                $('#dependentForm_isChildMarried :radio', '#' + this.containerId).removeAttr('checked');
                $('#dependentForm_isChildMarried #' + (model.isChildMarried ? "yesChildMarried" : "noChildMarried"), '#' + this.containerId).attr('checked', 'checked');
            }

            if (typeof model.isChildEmployed !== 'undefined') {
                $('#dependentForm_isChildEmployed :radio', '#' + this.containerId).removeAttr('checked');
                $('#dependentForm_isChildEmployed #' + (model.isChildEmployed ? "yesChildEmployed" : "noChildEmployed"), '#' + this.containerId).attr('checked', 'checked');
            }
        }

        $('#dependentForm_Relationship', '#' + this.containerId).on('change', function () {
            thisObject.updateChildOver18Fields();
        });

        // hook the event on the "IsFullTimeStudent" radio buttons
        $('#dependentForm_FullTimeStudent :radio', '#' + this.containerId).on('change', function () {
            isFullTimeStudent = $(this).attr('id') == "yesFullTimeStudent" && $(this).is(':checked');
            thisObject.updateFullTimeStudentDates(isFullTimeStudent);
        });

        // hook the event on the "HasFunctionalImpairment" radio buttons
        $('#dependentForm_FunctionalImpairment :radio', '#' + this.containerId).on('change', function () {
            hasFunctionalImpairment = $(this).attr('id') == "yesFunctionalImpairment" && $(this).is(':checked');
            thisObject.updateFunctionalImpairmentType(hasFunctionalImpairment);
        });

        // hook the event on the "IsFunctionalImpairmentPermanent" radio buttons
        $('#dependentForm_FunctionalImpairmentType :radio', '#' + this.containerId).on('change', function () {
            hasFunctionalImpairment = $('#yesFunctionalImpairment', '#' + thisObject.containerId).is(':checked');
            isFunctionalImpairmentTemporary = $(this).attr('id') == "noFunctionalImpairmentPermanent" && $(this).is(':checked');
            thisObject.updateFunctionalImpairmentDates(hasFunctionalImpairment && isFunctionalImpairmentTemporary);
        });

        this.updateChildOver18Fields();
        this.updateChildMarriedDate();
        this.updateChildEmployedDate();
        // hook the event on the dateofbirth field
        $('#dependentForm_BirthDate', '#' + this.containerId).on('blur', function () {
            thisObject.updateChildOver18Fields();
        });

        $('#dependentForm_isChildMarried :radio', '#' + this.containerId).on('change', function () {
            thisObject.updateChildMarriedDate();
        });

        $('#childMarriedDate', '#' + thisObject.containerId).on('blur', function () {
            $('#childMarriedDate', '#' + thisObject.containerId).redraw();
        });

        $('#dependentForm_isChildEmployed :radio', '#' + this.containerId).on('change', function () {
            thisObject.updateChildEmployedDate();
        });

        $('#childEmployedDate', '#' + thisObject.containerId).on('blur', function () {
            $('#childEmployedDate', '#' + thisObject.containerId).redraw();
        });
        
        var spouseRelationshipItem = JSLINQ(dataCache.applicationData.get(window.app.culture).relationships)
                                        .Where(function (item) { return item.code == 'sp'; })
                                        .FirstOrDefault(null);

        var spouseRelationshipNavId = spouseRelationshipItem ? spouseRelationshipItem.navId : 0;

        $('#dependentForm', '#' + this.containerId).validate({
            rules: {
                gender: { required: true },
                dateOfBirth: { required: true, checkIfPastDate: true },
                fullTimeStudentFrom: { checkIfPastDate: true},
                functionalImpairmentFrom: { checkIfPastDate: true },
                relationshipNavId: { limitDependentRelationshipType: { dependentId: model ? model.id : 0, relationshipType: spouseRelationshipNavId, limitCount: 1 } },
                childMarriedDate: { required: function (element) { return $('#yesChildMarried', '#' + thisObject.containerId).is(':checked'); } },
                childEmployedDate: { required: function (element) { return $('#yesChildEmployed', '#' + thisObject.containerId).is(':checked'); } }
            },
            invalidHandler: function (form, validator) {
                $("#" + thisObject.containerId + ' #validationError').show();
            },
            submitHandler: function (form) {
                event.preventDefault();
                $("#" + thisObject.containerId + ' #validationError').hide();
                if (!$('#childMarriedDate').is(':visible')) {
                    $('#childMarriedDate', '#' + thisObject.containerId).val('');
                }

                if (!$('#childEmployedDate').is(':visible')) {
                    $('#childEmployedDate', '#' + thisObject.containerId).val('');
                }

                /* TODO test if "from" is before "to" (FullTimeStudent & FunctionalImpairment) */
                if (window.app.currentProfile && window.app.isOnline) {
                    var profile = ProfileDal.getProfile(window.app.currentProfile.id);
                    var dependent = $(form).serializeObject();
                    dependent.studentId = app.currentProfile.studentId;
                    dependent.studentEmail = app.currentProfile.email;

                    if (dependent.isFullTimeStudent == 'false') {
                        dependent.fullTimeStudentFrom = null;
                        dependent.fullTimeStudentTo = null;
                    }

                    if (dependent.hasFunctionalImpairment == 'false') {
                        dependent.functionalImpairmentFrom = null;
                        dependent.functionalImpairmentTo = null;
                    }

                    if (model) {
                        // Update
                        webServices.updateDependent(dependent, function (data) {
                            profile = ProfileDal.importOnlineObject(profile, data);
                            ProfileDal.saveProfile(profile.id, profile);
                            window.app.currentProfile = profile;

                            window.app.screens.dependentList.show();
                        });
                    } else {
                        // Create
                        webServices.createDependent(dependent, function (data) {
                            profile = ProfileDal.importOnlineObject(profile, data);
                            ProfileDal.saveProfile(profile.id, profile);
                            window.app.currentProfile = profile;

                            window.app.screens.dependentList.show();
                        });
                    }
                } else {
                    // Show message: needs to be online to update profile
                    showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnlineToUpdateProfile);
                }
            }
        });
    },

    hasBackButton: function () { return true; },
    back: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.dependentList.show();
        });
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ProfileMenu_Title;
    },
    footerMenuProfile: true,
    next: function (screen) {
        this._super();
        screen.show();
    },

    submit: function () {
        this.next(this.nextScreen().submit);
    },

    cancel: function () {
        // keep a reference to "this"
        var thisObject = this;
        this.alertIfWatchedFormIsDirty(function () {
            thisObject.next(thisObject.nextScreen().cancel);
        });
    },
    watchedForm: function () { return $('#dependentForm', '#' + this.containerId); }
});
