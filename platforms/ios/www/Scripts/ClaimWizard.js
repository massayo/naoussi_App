/// <reference path="libs/jquery-1.7.2.js" />
/// <reference path="libs/handlebars.js" />
/// <reference path="libs/base.js" />
/// <reference path="libs/JSLINQ.js" />
/// <reference path="Views/claimWizard.js" />
/// <reference path="webServices.js" />
/// <reference path="main.js" />
/// <reference path="claims.js" />
/// <reference path="app.js" />
/// <reference path="../config.js" />

var claimWizard = {
    claim: {
        date: new Date(),
        type: "",
        persons: [],
        pictures: [],
        workInjury: false,
        motorVehiculeAccident: false,
        sportUseOnly: null,
        accidentDate: null,
        comments: '',
        addressChanged: false,
        ackDirectDeposit: false,
        guid: null,
        sequenceId: 0,
        pictureUpload: {
            guid: null,
            picturePosition: 0,
            pictureStreamPosition: 0,
            split: []
        },
        localSaved: false
    },
    isOrthopedic: function () { return claimWizard.claim.type == 'orthopedics'; },
    completedImage: "<img src='data:image/jpeg;base64,' />",
    inProgressImage: "<img src='data:image/jpeg;base64,' />",
    pages: {
        currentPosition: 0,
        pages: [],
        defautList: [
                "claimPersonSelectPage",
                "claimTypeSelectionPage",
                "claimConditionsPage",
                "claimPictureSelectionPage",
                "claimCommentsPage",
                "claimTermsPage",
                "claimUploadPage",
                "claimConfirmPage"
        ]
    },
    counterTakePictureTry: 0,
    timerIdTakePictureTry: -1,

    previousPage: function () {
        if (claimWizard.showingPictureHelp) {
            claimWizard.showingPictureHelp = false;
            claimWizard.hidePictureHelp();
            return;
        }

        if (claimWizard.pages.currentPosition == 0) {
            window.app.screens.mainMenu.home();
            return;
        }

        $("#" + claimWizard.pages.pages[claimWizard.pages.currentPosition]).hide();
        claimWizard.pages.currentPosition--;
        $("#" + claimWizard.pages.pages[claimWizard.pages.currentPosition]).show();

        claimWizard.initAckDirectDepositPage();
    },

    nextPage: function () {
        $("#" + claimWizard.pages.pages[claimWizard.pages.currentPosition]).hide();
        claimWizard.pages.currentPosition++;
        $("#" + claimWizard.pages.pages[claimWizard.pages.currentPosition]).show();

        claimWizard.initAckDirectDepositPage();
    },

    back: function () {
        if (claimWizard.showingFailedClaim) {
            claimWizard.uploadFailPrevious();
        }

        claimWizard.previousPage();
    },

    reset: function () {
        claimWizard.claim.guid = null;
        claimWizard.claim.sequenceId = 0;
        claimWizard.claim.type = '';
        claimWizard.claim.persons = [];
        claimWizard.claim.pictures = [];
        claimWizard.claim.workInjury = false;
        claimWizard.claim.motorVehiculeAccident = false;
        claimWizard.claim.comments = '';
        claimWizard.claim.pictureUpload.guid = null;
        claimWizard.claim.pictureUpload.picturePosition = 0;
        claimWizard.claim.pictureUpload.pictureStreamPosition = 0;
        claimWizard.claim.pictureUpload.split = [];
        claimWizard.showingFailedClaim = false;
        claimWizard.pages.currentPosition = 0;
        claimWizard.claim.localSaved = false;
        claimWizard.claim.addressChanged = false;
        claimWizard.claim.ackDirectDeposit = false;

        claimWizard.pages.pages = claimWizard.pages.defautList.slice();

        // Add optional pages.
        var associationData = dataCache.associationData.get(window.app.culture, window.app.currentProfile.associationId);
        if (associationData.insurer.addressValidation) {
            claimWizard.pages.pages.splice(1, 0, "claimAddressConfirmationPage");
        }

        // This page is shown if the insurer is configured to ask for acknowlegde the direct deposit information
        // and if the user have not already acknowleged it.
        if (associationData.insurer.ackDirectDepositRequest && !window.app.currentProfile.ackDirectDeposit) {
            claimWizard.pages.pages.splice(1, 0, "claimAckDirectDepositPage");
        }
    },

    // Step 1 - Person select - Next
    selectClaimPersons: function () {
        claimWizard.showingFailedClaim = false;
        claimWizard.completedImage = "<img src='data:image/jpeg;base64," + dataCache.uiContentsData.get(window.app.culture).Done.presentation + "' />";
        claimWizard.inProgressImage = "<img src='data:image/jpeg;base64," + dataCache.uiContentsData.get(window.app.culture).InProgress.presentation + "' />";

        claimWizard.pages.currentPosition = 0;

        var ids = [];
        var names = [];
        $("#claimPersonList input:checked", '#' + app.screens.claimWizard/*View*/.containerId).each(function () {
            ids[ids.length] = $(this).val();
            names[names.length] = $(this).html();
        });
        claimWizard.claim.persons = ids;
        claimWizard.claim.personNames = names;

        if (ids.length == 0) {
            $('#claimPersonSelectPageError').show();
            return;
        }

        if (window.app.currentProfile.dependents) {
            var selectedDependant = JSLINQ(window.app.currentProfile.dependents).Where(function (item) { return ids.indexOf(item.id + '') != -1; }).items;
            // if "DEPENDANT is a permanent student" and "end of study is expired": push notification & block
            if (JSLINQ(selectedDependant).Any(function (item) {
                if (!item.isFullTimeStudent) return false;
                if (typeof item.fullTimeStudentTo === 'undefined') return false;
                var dFullTimeStudentTo = (/\//g.test(item.fullTimeStudentTo)) /* hack: if string contains "/" */
                ? moment(item.fullTimeStudentTo, "DD/MM/YYYY")            /* then the format is ""dd/mm/yyyy" */
                : moment(item.fullTimeStudentTo, "YYYY-MM-DD");           /* else the format is "yyyy-mm-dd" */
                return (dFullTimeStudentTo.diff(moment(), 'secondes') < 0);
            })) {
                showAlert(dataCache.dictionary.get(window.app.culture).Claim_Wizard_No_Longer_Student_Alert);
                return;
            }

            // if "DEPENDANT has functional impairment": push notification (asking for joining the proof)
            if (JSLINQ(selectedDependant).Any(function (item) { return item.hasFunctionalImpairment; })) {
                showAlert(dataCache.dictionary.get(window.app.culture).Claim_Wizard_Add_Proof_For_Functional_Impairment_Alert);
            }
        }

        claimWizard.nextPage();
    },

    // Step 1.5 Address validation (optional)
    addressValidation: function () {
        claimWizard.claim.addressChanged = $('#addressChangedTrue').is(':checked');
        claimWizard.nextPage();
    },

    // Step 1.5 acknowledge the direct deposit information validation (optional)
    ackDirectDepositValidation: function () {
        claimWizard.claim.ackDirectDeposit = $('#ackDirectDepositYes').is(':checked');
        claimWizard.nextPage();
    },

    initAckDirectDepositPage: function () {
        if (claimWizard.pages.pages[claimWizard.pages.currentPosition] == 'claimAckDirectDepositPage') {
            $('#ackDirectDepositYes').click(function () { claimWizard.updateAckDirectDepositSelection(); });
            $('#ackDirectDepositNo').click(function () { claimWizard.updateAckDirectDepositSelection(); });

            claimWizard.updateAckDirectDepositSelection();
        }
    },

    updateAckDirectDepositSelection: function () {
        $("#resendDirectDepositMessageBtn").hide();

        if ($("#ackDirectDepositNo").is(':checked')) {
            $("#resendDirectDepositMessageBtn").show();
        }
    },

    resendDirectDepositMessage: function () {
        console.log('resendDirectDepositMessage');
        webServices.resendDirectDepositMessage(
            function /* success */(data) {
                if (data) {
                    showAlert(dataCache.dictionary.get(window.app.culture).Claim_AckDirectDeposit_An_Email_Has_Been_Sent);
                } else {
                    showAlert(dataCache.dictionary.get(window.app.culture).Common_An_Unexpected_Error_Occurred);
                }
            }
        );
    },

    // Step 2 - Claim Type - Next
    selectClaimType: function (element) {
        claimWizard.claim.type = $(element).attr('data-claim-type');
        // claimWizard.claim.pictures = [];
        var termText = claimWizard.getBenefitTypeTerms(claimWizard.claim.type);
        $('#claimTermsPage #claimTerms').html("<div class='message'><strong>" + termText + "</strong></div>");

        if (!$('#workInjuryTrue').is(':checked') && !$('#workInjuryFalse').is(':checked')) {
            if (!$('#accidentDate').is(':visible')) {
                $('#accidentDate').val(getCurrentDate());
            }
        }

        if (claimWizard.isOrthopedic()) {
            $('#isOrthopedicQuestion').show();
        } else {
            $('#isOrthopedicQuestion').hide();
        }

        // Show claim Type notification if enabled
        var claimTypeInfo = claimWizard.getBenefitTypeInfo(claimWizard.claim.type);
        if (claimTypeInfo)
        {
            if (claimTypeInfo.claimNotificationEnabled)
            {
                showAlert(claimTypeInfo.claimNotificationText);
            }
        }

        claimWizard.nextPage();
    },

    showAccidentDateGroup: function() {
        $('#accidentDateGroup').hide();

        if ($('#workInjuryTrue').is(':checked') || $('#motorVehiculeAccidentTrue').is(':checked'))
        {
            $('#accidentDateGroup').show();
            $('#accidentDate').val('');
        }
    },

    // Step 3 - Question about condition - Next
    submitClaimConditions: function () {
        var isValid = true;
        $('#showAccidentRequired').hide();
        $('#showConditionsRequired').hide();
        
        if (!$('#accidentDate').is(':visible'))
        {
            $('#accidentDate').val('');
        }

        // Check the workinjury checkbox
        if (!$('#workInjuryTrue').is(':checked') && !$('#workInjuryFalse').is(':checked')) {
            isValid = false;
        } else {
            claimWizard.claim.workInjury = $('#workInjuryTrue').is(':checked');
        }

        // Check the motor vehicule checkbox
        if (!$('#motorVehiculeAccidentTrue').is(':checked') && !$('#motorVehiculeAccidentFalse').is(':checked')) {
            isValid = false;
        } else {
            claimWizard.claim.motorVehiculeAccident = $('#motorVehiculeAccidentTrue').is(':checked');
        }

        if (!isValid) {
            $('#showConditionsRequired').show();
        }

        if (claimWizard.claim.motorVehiculeAccident || claimWizard.claim.workInjury) {
            if ($('#accidentDate').val()) {

                var value = $('#accidentDate').val();

                if (!/Invalid|NaN/.test(new Date(value))) {
                    isValid = parseDate(value) < new Date();
                    if (config.debug) {
                        console.log('Date: ' + isValid);
                    }
                } else if (isNaN(Number(value))) {
                    var date = moment(value, 'YYYY-MM-DD');
                    var today = moment();

                    isValid = today.diff(date, 'seconds') >= 0;
                    if (config.debug) {
                        console.log('Moment: ' + isValid);
                    }
                } else {
                    isValid = Number(value) < Number(new Date());
                    if (config.debug) {
                        console.log('Number: ' + isValid);
                    }
                }

                if (isValid) {
                    // Save Value
                    claimWizard.claim.accidentDate = $('#accidentDate').val();
                } else {
                    $('#showAccidentRequired').show();
                }
            } else {
                isValid = false;
                $('#showAccidentRequired').show();
            }
        }

        if (claimWizard.isOrthopedic())
        {
            claimWizard.claim.sportUseOnly = $('#isOrthopedicTrue').is(':checked');
        }
        
        if (isValid) {

            // Message about coordination of benefits
            if (window.app.currentProfile.insurers && window.app.currentProfile.insurers.length > 0) {
                showAlert(dataCache.dictionary.get(window.app.culture).Claim_Wizard_Coordination_Denial_Alert);
            }

            claimWizard.nextPage();
        }
    },

    showingPictureHelp: false,
    showPictureHelp: function () {
        claimWizard.showingPictureHelp = true;
        $('#claimPictureHelp').css('height', getHeight() - 130 + 'px');
        $('#claimPictureHelp').css('width', getWidth() - 20 + 'px');
        $("#claimPictureHelp").show();
    },
    hidePictureHelp: function () {
        claimWizard.showingPictureHelp = false;
        $("#claimPictureHelp").hide();
    },
    // Step 4 - Select pictures - Next
    claimSubmitPictures: function () {
        if (claimWizard.claim.pictures && claimWizard.claim.pictures.length > 0) {
            claimWizard.nextPage();
        } else {
            // But no risk of happening, the @next button is hidden
            showAlert(dataCache.dictionary.get(window.app.culture).Claim_OnePictureRequired);
        }
    },

    // Step 5 - Claim comments - Next
    submitClaimComments: function () {
        // Save Comments
        claimWizard.claim.comments = $('#claimCommentsPage #claimCommentText').val();

        claimWizard.nextPage();
    },

    cancelClaim: function () {
        showConfirm(dataCache.dictionary.get(window.app.culture).Claim_CancelClaim, function () {
            window.app.screens.mainMenu.show();
        });
    },

    cancelClaimUpload: function () {
        showConfirm(dataCache.dictionary.get(window.app.culture).Claim_CancelClaim, claimWizard.failClaim);
    },

    // Step 6 - Terms - Next
    submitClaimTerms: function () {
        if (window.app.currentProfile && window.app.isOnline) {
            $('#claimTermsPage #agreeLabel').removeClass('labelError');
            $('#claimTermsPage #agreeError').hide();
        
            // Validate that agree is checked, if not do nothing else
            if (!$('#claimTermsPage #agree').is(':checked')) {
                $('#claimTermsPage #agreeLabel').addClass('error');
                $('#claimTermsPage #agreeError').show();
                return;
            }

            showSpinner();

            // disable Next button
            var nextButton = $('a.btn.primary', 'div.form-actions');
            nextButton.attr('disabled', 'disabled');

            claimWizard.hideLogoutButton();
            claimWizard.hideBackButton();
            
            // Claim Info
            var claimInfo = {
                studentId: window.app.currentProfile.id,
                email: window.app.currentProfile.email,
                claimType: claimWizard.claim.type,
                persons: claimWizard.claim.persons,
                workInjury: claimWizard.claim.workInjury,
                motorVehiculeAccident: claimWizard.claim.motorVehiculeAccident,
                accidentDate: claimWizard.claim.accidentDate,
                comments: claimWizard.claim.comments,
                addressChanged: claimWizard.claim.addressChanged,
                ackDirectDeposit: claimWizard.claim.ackDirectDeposit,
                sportUseOnly: claimWizard.claim.sportUseOnly
            };

            // Start Upload
            webServices.createClaim(claimInfo,
                function /* success */(data) {
                    hideSpinner();
                    // reenable Next button
                    nextButton.removeAttr('disabled');
                    claimWizard.claim.guid = data;
                    claimWizard.nextPage(); // claimUploadPage
                    claimWizard.StartUpload("claimUploadPage", claimWizard.uploadSuccess, claimWizard.uploadFail);

                    window.app.currentProfile.ackDirectDeposit = claimWizard.claim.ackDirectDeposit;
                },
                function /* failure */(error) {
                    hideSpinner();
                    if (config.debug) { console.log(error); }
                    // reenable Next button
                    nextButton.removeAttr('disabled');
                    claimWizard.uploadFail();
                    return;
                }
            );
        } else {
            claimWizard.uploadFail();
        }
    },

    showBackButton: function () {
        $('#claimWizardContainer #headerPreviousPlaceHolder').show();
    },
    showLogoutButton: function () {
        $('#claimWizardContainer #headerLogoutButton').show();
    },
    hideBackButton: function () {
        $('#claimWizardContainer #headerPreviousPlaceHolder').hide();
    },
    hideLogoutButton: function () {
        $('#claimWizardContainer #headerLogoutButton').hide();
    },

    // Beginning of the upload - called after Terms
    StartUpload: function (uploadPageId, successCallBack, failCallBack) {
        $('#' + uploadPageId + ' #claimUploadProgress').html('');
        $('#' + uploadPageId + ' #claimUploadProgress').append(
            '<div class="group-wrapper transparent no-border">' +
            '   <div class="group-text-icon">' +
            '       <span class="group-text">' + dataCache.dictionary.get(window.app.culture).Claim_UploadInfo + ' </span>' +
            '       <span class="group-icon">' + claimWizard.completedImage + '</span>' +
            '   </div>' +
            '</div>');

        // Upload pictures
        claimWizard.ContinuePictureUpload(uploadPageId, successCallBack, failCallBack);
        $("footer").hide();
    },

    // Recursive function called to upload the pictures
    ContinuePictureUpload: function (uploadPageId, successCallBack, failCallBack) {
        if (!claimWizard.claim.guid || claimWizard.claim.guid == null) {
            if (failCallBack && typeof (failCallBack) === "function") {                
                failCallBack();
            }
            $("footer").show();
            return;
        }

        if (!window.app.isOnline) {
            if (failCallBack && typeof (failCallBack) === "function") {
                failCallBack();
            }
            $("footer").show();
            return;
        }

        if (claimWizard.claim.pictureUpload.guid) { // Started
            webServices.appendClaimFile(claimWizard.claim.pictureUpload.guid, claimWizard.claim.pictureUpload.split[claimWizard.claim.pictureUpload.pictureStreamPosition], function () {
                claimWizard.claim.pictureUpload.pictureStreamPosition++;

                if (claimWizard.claim.pictureUpload.pictureStreamPosition >= claimWizard.claim.pictureUpload.split.length) {

                    $('#' + uploadPageId +' #claimUploadProgress #fileUpload' + claimWizard.claim.pictureUpload.guid).html(claimWizard.completedImage);

                    claimWizard.claim.pictureUpload.picturePosition++;
                    claimWizard.claim.pictureUpload.pictureStreamPosition = 0;
                    claimWizard.claim.pictureUpload.guid = null;
                    claimWizard.claim.pictureUpload.split = [];

                    if (claimWizard.claim.pictureUpload.picturePosition >= claimWizard.claim.pictures.length) {
                        claimWizard.claim.pictureUpload.picturePosition = 0;

                        webServices.submitClaim(claimWizard.claim.guid, function (data) {
                            var isEmailSent = data.isEmailSent;
                            claimWizard.claim.sequenceId = data.seqId;

                            if (isEmailSent) {
                                if (successCallBack && typeof (successCallBack) === "function") {
                                    successCallBack(claimWizard.claim);
                                }
                            } else {
                                showAlert(dataCache.dictionary.get(window.app.culture).Common_An_Unexpected_Error_Occurred);
                                if (failCallBack && typeof (failCallBack) === "function") {
                                    failCallBack();
                                }
                            }
                        });
                        return;
                    }
                } else {
                    // var amount = claimWizard.claim.pictureUpload.pictureStreamPosition * 4;
                    // var percent = amount / claimWizard.claim.pictures[claimWizard.claim.pictureUpload.picturePosition].length;
                    // percent = percent * 100;
                    // $('#claimUploadPage #claimUploadProgress #fileUpload' + claimWizard.claim.pictureUpload.guid).html(claimWizard.inProgressImage);
                }

                if (claimWizard.claim.pictureUpload.pictureStreamPosition == 0 && config.debug) {
                    var timeout = setTimeout(function () { claimWizard.ContinuePictureUpload(uploadPageId, successCallBack, failCallBack); clearTimeout(timeout); }, 1000);
                }
                else {
                    claimWizard.ContinuePictureUpload(uploadPageId, successCallBack, failCallBack);
                }
            }, function (error) {
                if (config.debug) {
                    console.log(error);
                }

                if (failCallBack && typeof (failCallBack) === "function") {
                    failCallBack();
                }
                return;
            });
        } else { // Not started
            webServices.createClaimFile(claimWizard.claim.guid, 'image' + claimWizard.claim.pictureUpload.picturePosition, function (data) {
                if (data) {
                    claimWizard.claim.pictureUpload.pictureStreamPosition = 0;
                    claimWizard.claim.pictureUpload.guid = data;
                    claimWizard.claim.pictureUpload.split = splitImage(claimWizard.claim.pictures[claimWizard.claim.pictureUpload.picturePosition]);

                    $('#' + uploadPageId + ' #claimUploadProgress').append(
                        '<div class="group-wrapper transparent no-border">' +
                        '   <div class="group-text-icon">' +
                        '       <span class="group-text">' + dataCache.dictionary.get(window.app.culture).Claim_UploadFile + ' (' + (claimWizard.claim.pictureUpload.picturePosition + 1) +  '/' + claimWizard.claim.pictures.length + ')</span>' +
                        ' <span class="group-icon" id="fileUpload' + data + '">' + claimWizard.inProgressImage + '</span>' +
                        '   </div>' +
                        '</div>');

                    claimWizard.ContinuePictureUpload(uploadPageId, successCallBack, failCallBack);
                }
            }, function (error) {
                if (config.debug) {
                    console.log(error);
                }

                if (failCallBack && typeof (failCallBack) === "function") {
                    failCallBack();
                }
                return;
            });
        }
    },

    // If the upload completes with success - Transit to the confirmation page
    uploadSuccess: function () {
        $('#claimSubmissionError').hide();
        $('#claimFail').hide();

        window.app.isInClaimEdit = false;
        claimWizard.showLogoutButton();
        claimWizard.hideBackButton();

        $('#fileNumber').html(claimWizard.claim.sequenceId);

        // Clean data
        claimWizard.claim.guid = null;
        claimWizard.claim.sequenceId = 0;
        claimWizard.claim.type = '';
        claimWizard.claim.persons = [];
        claimWizard.claim.pictures = [];
        claimWizard.claim.workInjury = false;
        claimWizard.claim.motorVehiculeAccident = false;
        claimWizard.claim.comments = '';

        $('#claimFail').hide();
        claimWizard.nextPage();
        $("footer").show();

        app.forceReloadClaimHistory = true;
    },

    showingFailedClaim: false,
    // If the upload fails - Transit to the fail page
    uploadFail: function () {
        if (claimWizard.showingFailedClaim)
        {
            $("footer").show();
            // already failed
        }
        else
        {
            window.app.isInClaimEdit = false;
            claimWizard.showLogoutButton();

            claimWizard.showingFailedClaim = true;
            claimWizard.pages.currentPosition++;

            $('#claimTermsPage').hide();
            $('#claimUploadPage').hide();
            $('#claimSubmissionError').show();
            $("footer").show();
        }
    },

    // From the fail page - Returns to the terms page
    uploadFailPrevious: function () {
        claimWizard.pages.currentPosition -= 2;

        $('#claimSubmissionError').hide();
        $('#claimTermsPage').show();
    },

    // From the fail page - Restart sending claim
    uploadFailRetry: function () {
        claimWizard.showingFailedClaim = false;
        claimWizard.pages.currentPosition -= 2;
        $('#claimSubmissionError').hide();
        $('#claimTermsPage').show();
        // claimWizard.submitClaimTerms();
    },

    failClaim: function () {
        window.app.isInClaimEdit = false;
        claimWizard.showingFailedClaim = true;

        claimWizard.claim.guid = null;

        $('#claimUploadPage').hide();
        $('#claimSubmissionError').hide();
        $('#claimFail').show();
        $("footer").show();

        if (claimWizard.claim) {
            if (!claimWizard.claim.localSaved) {
                Claims.addFailedClaim(claimWizard.claim);
            }
        }
    },

    // Add image to image list
    addImage: function (data) {
        try 
        {
            var imageUl = $('#claimPictureSelectionPage #claimWizardImageList');
            
            var itemLi = '<li><div class="thumbnail" onclick="showFull(this, ' + claimWizard.claim.pictures.length + ');"><img src="data:image/jpeg;base64,' + data + '"  width="45" /></div></li>';
            
            claimWizard.claim.pictures[claimWizard.claim.pictures.length] = data;
            
            var position = claimWizard.claim.pictures.length;
            
            $("li:nth-child(" + position + ")", imageUl).replaceWith(itemLi);
            
            $('#claimPictureSelectionPageNext').show();
            
            $('#claimWizardTakePictureButton').show();
            
            $('#claimWizardPhotoFromLibraryButton').show();
            
            if (claimWizard.claim.pictures.length >= 5) {
                if (config.debug) { console.log('hide buttons'); }
                $('#claimWizardTakePictureButton').hide();
                $('#claimWizardPhotoFromLibraryButton').hide();
            }
        } catch (err) {
            setTimeout(function () { showAlert('Error: ' + err.message); }, 0);
        }
    },
    
    removeImage: function (position) {
        claimWizard.claim.pictures.splice(position, 1);
        $($('#claimPictureSelectionPage #claimWizardImageList li')[position]).remove();
        $($('#claimPictureSelectionPage #claimWizardImageList')).append('<li><div class="thumbnail"></li>');

        if (claimWizard.claim.pictures.length == 0) {
            $('#claimPictureSelectionPageNext').hide();
        }

        $('#claimWizardTakePictureButton').show();
        $('#claimWizardPhotoFromLibraryButton').show();

        if (claimWizard.claim.pictures.length >= 5) {
            $('#claimWizardTakePictureButton').hide();
            $('#claimWizardPhotoFromLibraryButton').hide();
        }
    },
    
    takePicture: function () {
        
        claimWizard.counterTakePictureTry++;
        if (claimWizard.counterTakePictureTry > 1 && claimWizard.timerIdTakePictureTry < 0) {
            claimWizard.timerIdTakePictureTry = setInterval(function () {
                showAlert(dataCache.dictionary.get(window.app.culture).Claim_Refuse_Localisation_Info);
                clearInterval(claimWizard.timerIdTakePictureTry);
                claimWizard.timerIdTakePictureTry = -1;
            }, 30000);
        }
		if (!navigator.camera) {
			alert("Camera API not supported", "Error");
			return;
		}


        if (isOnDevice() && navigator.camera) {
            try
            {
                navigator.camera.getPicture(
                /*success*/function (/*base64*/imageData) {
                    claimWizard.addImage(imageData);
                    claimWizard.counterTakePictureTry = 0;
                    if (claimWizard.timerIdTakePictureTry >= 0) {
                        clearInterval(claimWizard.timerIdTakePictureTry);
                        claimWizard.timerIdTakePictureTry = -1;
                    }
                },
                /*error*/function (message) {
                    if (config.debug) {
                        console.log('cameraError');
                    } else {
                       //showAlert('Error: ' + message);
                       claimWizard.showPictureHelp();
                    }
                },
                            {
                                quality: 75,
                                destinationType: navigator.camera.DestinationType.DATA_URL,
                                sourceType: navigator.camera.PictureSourceType.CAMERA,
                                encodingType: navigator.camera.EncodingType.JPEG
                            });
            }
            catch (err)
            {
                showAlert('Error: ' + err.message);
            }
        }
    },

    takePictureFromLibrary: function () {
        if (isOnDevice() && navigator.camera) {
            navigator.camera.getPicture(
            /*success*/function (/*base64*/imageData) { claimWizard.addImage(imageData); },
            /*error*/function () { 
            		if (config.debug) { 
            			console.log('cameraError'); 
            		} else {
            			//showAlert('Error: ' + message);
            			claimWizard.showPictureHelp();
            		} 
            		},
                    {
                        quality: 75,
                        destinationType: navigator.camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        encodingType: navigator.camera.EncodingType.JPEG
                    });
        } else {
            showAlert('No Picture Camera found! Sending temp data.');
            var base64Image = tempData.testImage;

            claimWizard.addImage(base64Image);
        }


        $(".form-actions a.btn.secondary").removeClass("alone");
    },

    getBenefitTypeTerms: function (type) {
        var appData = dataCache.applicationData.get(window.app.culture);
        var terms = appData.terms;
        for (var i = 0; i < appData.claimTypes.length; i++) {
            if (appData.claimTypes[i].type == type) {
                terms = appData.claimTypes[i].terms;
            }
        }

        return terms; // appData.terms;
    },

    getBenefitTypeInfo: function (type) {
        var appData = dataCache.applicationData.get(window.app.culture);
        for (var i = 0; i < appData.claimTypes.length; i++) {
            if (appData.claimTypes[i].type == type) {
                return appData.claimTypes[i];
            }
        }

        return null;
    }
}
