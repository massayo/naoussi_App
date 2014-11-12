/// <reference path="../libs/jquery-1.7.2.js" />
/// <reference path="../libs/handlebars.js" />
/// <reference path="../libs/base.js" />
/// <reference path="../libs/JSLINQ.js" />
/// <reference path="../webServices.js" />
/// <reference path="../main.js" />
/// <reference path="../app.js" />
/// <reference path="../../config.js" />
/// <reference path="../Models/profile.js" />

var CoordinationBenefitFormView = View.extend({
    init: function (containerId, templateId, nextScreen) {
        this._super(containerId, templateId);
        this.nextScreen = nextScreen;
    },
    getData: function (callback) {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    },
    screenTitle: function () {
        return dataCache.dictionary.get(window.app.culture).ProfileMenu_Title;
    },
    footerMenuProfile: true,
    next: function () {
        this._super();
        this.nextScreen().show();
    },

    updatePlanOwnerSelected: function () {
        var associationData = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId);

        $("#" + this.containerId + " #beneficiaryForm #otherOwnsThePlan").hide();

        if ($("#" + this.containerId + " #beneficiaryForm #isStudentPlanOwnerNo").is(':checked')) {
            $("#" + this.containerId + " #beneficiaryForm #otherOwnsThePlan").show();

            $('#' + this.containerId + ' #firstName').addClass('required');
            $('#' + this.containerId + ' #lastName').addClass('required');
            $('#' + this.containerId + ' #gender').addClass('required');
            $('#' + this.containerId + ' #dateOfBirth').addClass('required');
        }
        else {
            $('#' + this.containerId + ' #firstName').removeClass('required');
            $('#' + this.containerId + ' #firstName').parent().removeClass('labelError');

            $('#' + this.containerId + ' #lastName').removeClass('required');
            $('#' + this.containerId + ' #lastName').parent().removeClass('labelError');

            $('#' + this.containerId + ' #gender').removeClass('required');
            $('#' + this.containerId + ' #gender').parent().removeClass('labelError');

            $('#' + this.containerId + ' #dateOfBirth').removeClass('required');
            $('#' + this.containerId + ' #dateOfBirth').parent().removeClass('labelError');
        }

    },

    dateOfBirthIsRequired: function (element) {
        var parent = $(element).parent();
        while (parent.attr('id') != 'beneficiaryForm') {
            parent = parent.parent();
        }

        return $('#isStudentPlanOwnerNo', parent).is(':checked');
    },

    updateOtherInsurerSelected: function () {
        var associationData = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId);

        $("#" + this.containerId + " #beneficiaryForm #OtherInsurer_Fields").hide();
        $("#" + this.containerId + " #beneficiaryForm #InsurerSelf_Fields").hide();

        if ($("#" + this.containerId + " #beneficiaryForm #isSelfYes").is(':checked')) {
            $("#" + this.containerId + " #beneficiaryForm #InsurerSelf_Fields").show();

            // Contract Number
            if (associationData.insurer.coordinationSelfAskContractNumber) {
                $('#' + this.containerId + ' #DFSContractNumber').addClass('required');
                $('#' + this.containerId + ' #SelfContractNumberField').show();
            } else { $('#' + this.containerId + ' #SelfContractNumberField').hide(); }

            // Certificate Number
            if (associationData.insurer.coordinationSelfAskCertificateNumber) {
                $('#' + this.containerId + ' #DFSCertificateNumber').addClass('required');
                $('#' + this.containerId + ' #SelfCertificateNumberField').show();
            } else { $('#' + this.containerId + ' #SelfCertificateNumberField').hide(); }

            $('#' + this.containerId + ' #otherInsurerName').removeClass('required');
            $('#' + this.containerId + ' #otherInsurerCoverageFrom').removeClass('required');
        }

        if ($("#" + this.containerId + " #beneficiaryForm #isSelfNo").is(':checked')) {
            $("#" + this.containerId + " #beneficiaryForm #OtherInsurer_Fields").show();

            $('#' + this.containerId + ' #DFSContractNumber').removeClass('required');
            $('#' + this.containerId + ' #DFSCertificateNumber').removeClass('required');
            
            $('#' + this.containerId + ' #otherInsurerName').addClass('required');
            
            // Other Contract Number
            if (associationData.insurer.coordinationOtherAskContractNumber) {
                $('#' + this.containerId + ' #OtherContractNumberField').show();
                $('#' + this.containerId + ' #OtherContractNumberField').addClass('required');
            }
            else {
                $('#' + this.containerId + ' #OtherContractNumberField').hide();
                $('#' + this.containerId + ' #OtherContractNumberField').removeClass('required');
            }

            // Other Employer Name
            if (associationData.insurer.coordinationOtherAskContractNumber) {
                $('#' + this.containerId + ' #OtherEmployerNameField').show();
            }
            else { $('#' + this.containerId + ' #OtherEmployerNameField').hide(); }

            // Coverage Period
            if (associationData.insurer.coordinationOtherAskCoveragePeriod)
            {
                $('#' + this.containerId + ' #InsurerOtherCoveragePeriodFields').show();
                $('#' + this.containerId + ' #otherInsurerCoverageFrom').addClass('required');
            }
            else {
                $('#' + this.containerId + ' #InsurerOtherCoveragePeriodFields').hide();
                $('#' + this.containerId + ' #otherInsurerCoverageFrom').removeClass('required');
            }

            // Type of benefits
            if (associationData.insurer.coordinationOtherAskType) {
                $('#' + this.containerId + ' #InsurerOtherTypeField').show();
            } else { $('#' + this.containerId + ' #InsurerOtherTypeField').hide(); }

        }
    },
    hasBackButton: function () { return true; },
    back: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.coordinationBenefitList.show();
        });
    },

    cancel: function () {
        this.alertIfWatchedFormIsDirty(function () {
            window.app.screens.coordinationBenefitList.show();
        });
    },

    watchedForm: function () { return $('#beneficiaryForm', '#' + this.containerId); },
    afterShow: function () {
        this._super();
        window.app.isInProfileEdit = true;

        var model = this.getModel();

        if (model) {
            // unset radio
            $("#" + this.containerId + " #beneficiaryForm option").attr('checked', '');

            if (model.gender) {
                $("#" + this.containerId + " #beneficiaryForm #gender").val(model.gender);
            }

            // Set plan onwer
            if (model.isStudentPlanOwner) {
                $("#" + this.containerId + " #beneficiaryForm #isStudentPlanOwnerYes").attr('checked', 'checked');
            } else {
                $("#" + this.containerId + " #beneficiaryForm #isStudentPlanOwnerNo").attr('checked', 'checked');
            }

            // Set benefit insurer display
            if (model.isDfs) {
                $("#" + this.containerId + " #beneficiaryForm #isSelfYes").attr('checked', 'checked');
            } else {
                $("#" + this.containerId + " #beneficiaryForm #isSelfNo").attr('checked', 'checked');
            }

            if (model.otherInsurerCoverageTypeBenefit) {
                $('#' + this.containerId + ' [name="otherInsurerCoverageTypeBenefit"]').each(function () {
                    var current = $(this);

                    var coverageType = JSLINQ(model.otherInsurerCoverageTypeBenefit).Where(function (x) {
                        return x.coordinationBenefitTypeNavId == current.val();
                    }).FirstOrDefault();

                    if (coverageType) {
                        $(this).attr('checked', 'checked');
                        $('#' + $(this).attr('data-referenceInputId')).val(coverageType.coverageTypeNavId);
                    }
                });
            }
        }

        this.updateOtherInsurerSelected();
        this.updatePlanOwnerSelected();

        $("#" + this.containerId + " #beneficiaryForm #isSelfYes").click(function () { window.app.screens.coordinationBenefitForm.updateOtherInsurerSelected(); });
        $("#" + this.containerId + " #beneficiaryForm #isSelfNo").click(function () { window.app.screens.coordinationBenefitForm.updateOtherInsurerSelected(); });

        $("#" + this.containerId + " #beneficiaryForm #isStudentPlanOwnerYes").click(function () { window.app.screens.coordinationBenefitForm.updatePlanOwnerSelected(); });
        $("#" + this.containerId + " #beneficiaryForm #isStudentPlanOwnerNo").click(function () { window.app.screens.coordinationBenefitForm.updatePlanOwnerSelected(); });

        $('#' + this.containerId + ' [name="otherInsurerCoverageTypeBenefit"]').change(function () {
            var otherInsurerCoverageTypeCoverage = $('#' + $(this).attr('data-referenceInputId'));
            if (!$(this).is(':checked')) {
                otherInsurerCoverageTypeCoverage.val(otherInsurerCoverageTypeCoverage.children(':first'));
            }
        });

        $('#' + this.containerId + ' [name="otherInsurerCoverageTypeCoverage"]').change(function () {
            var referenceInputId = $('#' + $(this).attr('data-referenceInputId'));
            if ($(this).val()) {
                referenceInputId.attr('checked', 'checked');
            }
            else {
                referenceInputId.removeAttr('checked');
            }

        });

        // Validation
        var thisObject = this;
        $("#" + this.containerId + ' #beneficiaryForm').validate({
            rules: {
                commonValidation: {
                    required: function (element) {
                        var isValid = true;
                        $('#' + thisObject.containerId + ' [name="otherInsurerCoverageTypeBenefit"]').each(function () {
                            var otherInsurerCoverageTypeCoverage = $('#' + $(this).attr('data-referenceInputId'));
                            $(this).parent().removeClass('labelError');
                            otherInsurerCoverageTypeCoverage.removeClass('error');

                            if ($(this).is(':checked') && !otherInsurerCoverageTypeCoverage.val()) {
                                isValid = false;
                                $(this).parent().addClass('labelError');
                                otherInsurerCoverageTypeCoverage.addClass('error');
                            }
                        });

                        var isSelfYes = $('#' + thisObject.containerId + ' #isSelfYes');
                        var isSelfNo = $('#' + thisObject.containerId + ' #isSelfNo');
                        $(isSelfYes).parent().removeClass('labelError');
                        $(isSelfNo).parent().removeClass('labelError');

                        if (!$(isSelfYes).is(':checked') && !$(isSelfNo).is(':checked'))
                        {
                            $(isSelfYes).parent().addClass('labelError');
                            $(isSelfNo).parent().addClass('labelError');
                            isValid = false;
                        }

                        var isStudentPlanOwnerYes = $('#' + thisObject.containerId + ' #isStudentPlanOwnerYes');
                        var isStudentPlanOwnerNo = $('#' + thisObject.containerId + ' #isStudentPlanOwnerNo');
                        $(isStudentPlanOwnerYes).parent().removeClass('labelError');
                        $(isStudentPlanOwnerNo).parent().removeClass('labelError');

                        if (!$(isStudentPlanOwnerYes).is(':checked') && !$(isStudentPlanOwnerNo).is(':checked')) {
                            $(isStudentPlanOwnerYes).parent().addClass('labelError');
                            $(isStudentPlanOwnerNo).parent().addClass('labelError');
                            isValid = false;
                        }

                        return !isValid;
                    }
                },
                //                DFSContractNumber: { required: function (element) {
                //                    return $('#' + thisObject.containerId + ' #isSelfYes').is(':checked'); }
                //                },
                //                DFSCertificateNumber: { required: function (element) { 
                //                    return $('#' + thisObject.containerId + ' #isSelfYes').is(':checked'); }
                //                },
                dateOfBirth: { required: thisObject.dateOfBirthIsRequired, checkIfPastDate: thisObject.dateOfBirthIsRequired }
            },

            invalidHandler: function (form, validator) {
                $("#" + thisObject.containerId + ' #validationError').show();
            },
            submitHandler: function (form) {
                event.preventDefault();
                $("#" + thisObject.containerId + ' #validationError').hide();

                if (window.app.currentProfile) {
                    // Update online
                    if (window.app.isOnline) {
                        var formObject = $(form).serializeObject();
                        formObject.otherInsurerCoverageTypeBenefit = [];

                        $('#' + thisObject.containerId + ' [name="otherInsurerCoverageTypeBenefit"]').each(function () {
                            var otherInsurerCoverageTypeCoverage = $('#' + $(this).attr('data-referenceInputId'));
                            if ($(this).is(':checked')) {
                                formObject.otherInsurerCoverageTypeBenefit.push({
                                    coordinationBenefitTypeNavId: $(this).val(),
                                    coverageTypeNavId: otherInsurerCoverageTypeCoverage.val()
                                });
                            }
                        });

                        var insurer = ProfileDal.parseInsurerForm(formObject);

                        insurer.studentId = app.currentProfile.studentId;
                        insurer.studentEmail = app.currentProfile.email;

                        if (model) {
                            // Update
                            webServices.updateInsurer(insurer, function (data) {
                                var profile = ProfileDal.importOnlineObject(app.currentProfile, data);

                                ProfileDal.saveProfile(profile.id, profile);
                                window.app.currentProfile = profile;
                                window.app.culture = profile.cultureCode;

                                app.screens.coordinationBenefitList.show();
                            });
                        } else {
                            // Create
                            webServices.createInsurer(insurer, function (data) {
                                var profile = ProfileDal.importOnlineObject(app.currentProfile, data);

                                ProfileDal.saveProfile(profile.id, profile);
                                window.app.currentProfile = profile;
                                window.app.culture = profile.cultureCode;

                                app.screens.coordinationBenefitList.show();
                            });
                        }
                    } else {
                        // Show message: needs to be online to update profile
                        showAlert(dataCache.dictionary.get(window.app.culture).Common_NeedOnlineToUpdateProfile);
                    }
                }
            }
        });
    }
});