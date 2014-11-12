/// <reference path="libs/jquery-1.7.2.js" />
/// <reference path="libs/handlebars.js" />
/// <reference path="libs/base.js" />
/// <reference path="libs/JSLINQ.js" />
/// <reference path="webServices.js" />
/// <reference path="main.js" />
/// <reference path="../config.js" />

var Claims = {
    localFailedClaimsStorageKey: 'FailedClaims',
    listFailedClaims: function (callback) {
        readChunk(Claims.localFailedClaimsStorageKey, function (data) {
            var failedClaims = null;
            if (data) {                
                try
                {
                    data = decodeURIComponent(data);
                    failedClaims = JSON.parse(data);

                    for (var i = 0; i < failedClaims.length; i++) {
                        var claim = failedClaims[i];
                        claim.position = i;
                        failedClaims[i] = claim;
                    }
                } catch (ex) {
                    showAlert("Error: " + ex.message);
                    if (config.debug) {
                        $('#dumpTest').show();
                        try {
                            $('#dumpTestContent').val(data);
                        } catch (ex) { showAlert("Sub Error: " + ex.message); }
                    }

                    callback(null);
                }
            }

            if (callback && typeof (callback) === "function") {
                callback(failedClaims);
            }
        });
    },
    addFailedClaim: function (claim) {
        Claims.listFailedClaims(function (failedClaims) {
            if (!failedClaims) {
                failedClaims = [];
            }

            claim.localSaved = true;
            failedClaims.push(claim);

            try {
                
                writeChunk(Claims.localFailedClaimsStorageKey, JSON.stringify(failedClaims));
                //writeChunk(Claims.localFailedClaimsStorageKey, 'Test');
            }
            catch (err) {
                showAlert(err.message);
            }
        });
    },
    removeFailedClaim: function (position, callback) {
        Claims.listFailedClaims(function (failedClaims) {

            if (failedClaims) {
                failedClaims.splice(position, 1);
                try {
                    writeChunk(Claims.localFailedClaimsStorageKey, JSON.stringify(failedClaims));
                    // window.localStorage.setItem(Claims.localFailedClaimsStorageKey, JSON.stringify(failedClaims));
                }
                catch (err) {
                    showAlert(err.message);
                }
            }

            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
    },
    resendFailedClaim: function (claim, uploadPageId, successCallback, failCallback) {
        if (window.app.currentProfile && window.app.isOnline) {
            claim.callback = successCallback;

            claim.pictureUpload.guid = null;
            claim.pictureUpload.picturePosition = 0;
            claim.pictureUpload.pictureStreamPosition = 0;
            claim.pictureUpload.split = [];

            var claimInfo = {
                studentId: window.app.currentProfile.id,
                email: window.app.currentProfile.email,
                claimType: claim.type,
                persons: claim.persons,
                workInjury: claim.workInjury,
                motorVehiculeAccident: claim.motorVehiculeAccident,
                accidentDate: claim.accidentDate,
                comments: claim.comments,
                addressChanged: claimWizard.claim.addressChanged,
                sportUseOnly: claimWizard.claim.sportUseOnly
            };

            webServices.createClaim(claimInfo, function (data) {
                claim.guid = data;
                // Claims._continuePictureUpload(claim);

                claimWizard.claim = claim;
                claimWizard.StartUpload(uploadPageId, successCallback, failCallback);

            }, function (error) {
                if (config.debug) {
                    console.log(error);
                }

                if (failCallback && typeof (failCallback) === "function") {
                    failCallback(claim);
                }

                return;
            }
            );
        } else {
            if (failCallback && typeof (failCallback) === "function") {
                failCallback(claim);
            }
        }
    }
    //_uploadFail: function (claim) {
    //    showAlert(dataCache.dictionary.get(window.app.culture).Claim_UploadFail_Text);
    //},
    //_uploadSuccess: function (claim) {
    //    showAlert(dataCache.dictionary.get(window.app.culture).Claim_UploadSuccess_Text);
    //    Claims.removeFailedClaim(claim.position, claim.callback);
    //},
    //_continuePictureUpload: function (claim) {
    //    if (!claim.guid) {
    //        Claims._uploadFail();
    //        return;
    //    }

    //    if (!window.app.isOnline) {
    //        Claims._uploadFail();
    //        return;
    //    }

    //    if (claim.pictureUpload.guid) { // Started
    //        webServices.appendClaimFile(claim.pictureUpload.guid, claim.pictureUpload.split[claim.pictureUpload.pictureStreamPosition], function () {
    //            claim.pictureUpload.pictureStreamPosition++;

    //            if (claim.pictureUpload.pictureStreamPosition >= claim.pictureUpload.split.length) {
    //                claim.pictureUpload.picturePosition++;
    //                claim.pictureUpload.pictureStreamPosition = 0;
    //                claim.pictureUpload.guid = null;
    //                claim.pictureUpload.split = [];

    //                if (claim.pictureUpload.picturePosition >= claim.pictures.length) {
    //                    claim.pictureUpload.picturePosition = 0;

    //                    webServices.submitClaim(claim.guid, function (data) {
    //                        var isEmailSent = data.isEmailSent;
    //                        claim.sequenceId = data.seqId;
                            
    //                        if (isEmailSent) {
    //                            Claims._uploadSuccess(claim);
    //                        } else {
    //                            showAlert(dataCache.dictionary.get(window.app.culture).Common_An_Unexpected_Error_Occurred);
    //                            Claims._uploadFail();
    //                        }
    //                    });
                        
    //                    return;
    //                }
    //            }

    //            Claims._continuePictureUpload(claim);
    //        }, function (error) {
    //            if (config.debug) {
    //                console.log(error);
    //            }

    //            Claims._uploadFail();
    //            return;
    //        });
    //    } else { // Not started
    //        webServices.createClaimFile(claim.guid, 'image' + claim.pictureUpload.picturePosition, function (data) {
    //            if (data) {
    //                claim.pictureUpload.pictureStreamPosition = 0;
    //                claim.pictureUpload.guid = data;
    //                claim.pictureUpload.split = splitImage(claim.pictures[claim.pictureUpload.picturePosition]);

    //                Claims._continuePictureUpload(claim);
    //            }
    //        }, function (error) {
    //            if (config.debug) {
    //                console.log(error);
    //            }

    //            Claims._uploadFail();
    //            return;
    //        });
    //    }
    //}
}