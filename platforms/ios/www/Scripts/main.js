/// <reference path="app.js" />
/// <reference path="webServices.js" />
/// <reference path="libs/handlebars.js" />
/// <reference path="libs/jquery-1.7.2.js" />
/// <reference path="libs/moment.min-1.7.2.js" />
/// <reference path="libs/JSLINQ.js" />
/// <reference path="../config.js"/>
delete $.validator.methods.date;
$.validator.addMethod(
    "regex",
    function (value, element, regexp) {
        "use strict";
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "Please check your input."
);

$.validator.addMethod(
    "checkIfPastDate",
    function (value, element, params) {
        if (typeof params == 'undefined' || !params) { return true; }

        if (!/Invalid|NaN/.test(new Date(value))) {
            return parseDate(value) < new Date();
        }
        else if (isNaN(Number(value))) {
            var date = moment(value, 'YYYY-MM-DD');
            var today = moment();

            return today.diff(date, 'seconds') >= 0;
        }

        return Number(value) < Number(new Date());
    },
    'Date must be in the past.'
);

$.validator.addMethod(
    "limitDependentRelationshipType",
    function (value, element, params) {
        if (typeof params == 'undefined') { return true; }

        var dependentId = params.dependentId;
        var relationshipType = params.relationshipType;
        var limitCount = params.limitCount;

        if (value != relationshipType) { return true; }

        // Select Dependents of type excluding this one
        var dependants = ProfileDal.listAllDependents(window.app.currentProfile);
        var hasDependants = (dependants && dependants.length > 0);
        if (!hasDependants)
        {
            return true;
        }

        var otherSimilarDependents = JSLINQ(dependants)
                                        .Where(function (item) { return item.id != dependentId && item.relationshipNavId == relationshipType; })
                                        .items;

        // Return if count <= limit
        return otherSimilarDependents.length < limitCount;
    },
    'Too much.'
);

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var validatorTimer;
var focusinTimer;
var scrollPosition;
var focusControl;
$.validator.setDefaults({
    debug: config.debug,    
    errorElement: "span",
    errorPlacement: function (error, element) {
        $(error).addClass("control-group");
        if (!$(element).hasClass('required')) {
            if ($(element).is(':radio')) {
                $(element).parent().parent().before(error);
            } else {
                $(element).parent().parent().prepend(error);
            }
        }        
    },
    highlight: function (element, errorClass) {
        $(element).addClass(errorClass);
        $("label[for=" + element.id + "]").addClass('labelError');
    },
    unhighlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
        $("label[for=" + element.id + "]").removeClass('labelError');
    },
    ignore: []    
});

document.addEventListener("deviceready", deviceReady, false);

function getHeight() {
    // return $(window).height();
    return $(window).innerHeight();
}

function getWidth() {
    // return $(window).width();
    return $(window).innerWidth();
}
var redrawDelay = 100;
jQuery.fn.redraw = function () {
    this.hide();
    var thisObject = this;
    setTimeout(function () { thisObject.show(); }, redrawDelay);
};

$(document).ready(function () {
    
    // showSpinner();

    $('section').css('height', getHeight() + 'px');
    $('section').css('width', getWidth() + 'px');

    /* 
    register custom handlebars helpers 
    */

    // set first item as active
    Handlebars.registerHelper('each-first-active', function (context, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";

        if (context && context.length > 0) {
            for (var i = 0, j = context.length; i < j; i++) {
                ret = ret + fn($.extend({}, context[i], { active: i == 0 ? 'active' : '' }));
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    });

    // convert object to json
    Handlebars.registerHelper('json', function (data) {
        return JSON.stringify(data);
    });

    // convert date to string following a format
    Handlebars.registerHelper('date-to-string', function (date) {
        return formatDate(date);
        //return moment(new Date(date)).format('L');
    });

    // convert relationshipNavId into a readable text
    Handlebars.registerHelper('navid-to-value', function (cameleonList) {
        if (typeof cameleonList == 'undefined' || !$.isArray(cameleonList)) return '';
        var navId = this.relationshipNavId;
        var result = JSLINQ(cameleonList).First(function (item) { if (item.navId == navId) { return item; } });
        return result ? result.value : '';
    });

    // helper for debugging purpose
    Handlebars.registerHelper("debug", function (optionalValue) {
        if (config.debug) {
            console.log("Current Context");
            console.log("====================");
            console.log(this);

            if (optionalValue) {
                console.log("Value");
                console.log("====================");
                console.log(optionalValue);
            }
        }
    });
    
    // initialize application
    window.app.initialize();

    if (config.debug) {
        $("html").attr('class', 'debug');
    }

    //http://debug.phonegap.com/target/target-script-min.js#fdb6357a-dd9e-11e1-a9c9-1231391c98a7
});

function onResume() {
    if (config.debug) { console.log('application resume'); }

    checkConnection();

    // if logged-in and chose to automatically logout on resume, then logout
    if (window.app.currentProfile) {
        if (config.debug) {
            console.log("window.app.currentProfile.automaticLogout: " + window.app.currentProfile.automaticLogout);
        }
        if (window.app.currentProfile.automaticLogout) {
            $('.screen').hide();
            window.app.currentProfile = null;
            window.app.screens.welcome.show();
        }
    }

    if (config.debug) {
        console.log("window.app.isInProfileEdit: " + window.app.isInProfileEdit);
    }

    // if in profile edit, auto logout
    if (window.app.isInProfileEdit) {
        window.app.currentProfile = null;
        window.app.screens.welcome.show();
    }

    if (config.debug) {
        console.log("window.app.isInProfileWizard: " + window.app.isInProfileWizard);
    }

    // if in claim, auto logout
    if (window.app.isInClaimEdit) {
        window.app.currentProfile = null;
        window.app.screens.welcome.show();
    }

}

function onPause() {
    if (config.debug) { console.log('application pause'); }
    // lock app if profile is secured
}



function onOnline() {
    if (config.debug) { console.log('application online'); }
    window.app.isOnline = true;
}

function onOffline() {
    if (config.debug) { console.log('application offline'); }
    window.app.isOnline = false;
}

function onBackButton() {
    window.app.currentScreen.back();
    // NOT IN IOS
    if (config.debug) { console.log('application backbutton'); }
}

function deviceReady() {    
    if (config.debug) { console.log('deviceready'); }

    document.addEventListener("pause", onPause, false);

    document.addEventListener("resume", onResume, false);
    
    document.addEventListener("online", onOnline, false);

    document.addEventListener("offline", onOffline, false);

    document.addEventListener("backbutton", onBackButton, false);

	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
    checkConnection();    
}

function checkConnection() {
    var changed = false;
    if (isOnDevice() && navigator.network && Connection) {
        var networkState = navigator.network.connection.type;

        if (networkState == Connection.NONE) {
            window.app.isOnline = false;
        }
        else {
            if (window.app.isOnline == false) {
                changed = true;
            }

            window.app.isOnline = true;
        }
    }
    else {

    }

    if (changed)
    {
        webServices.getEndpoints(function (eData) {
            if (eData) {
                // The endpoints are loaded - Do nothing else
            }
            else {
                // The endpoints are not loaded - Stop right there 
                app.screens.loadingApplication.show();
            }
        });
    }
}

function showConnection()
{
    if (config.showOnlineStatus) {
        if (isOnDevice() && navigator.network && Connection) {
            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.NONE] = 'No network connection';

            var networkState = navigator.network.connection.type;

            showAlert('Online: ' + window.app.isOnline + ' State: ' + states[networkState]);
        }
        else {
            showAlert('Online: ' + window.app.isOnline);
        }
    }
}

function showOverlay(id, oldId) {
    if (config.debug) { console.log('ShowOverlay'); }
    //$(document).scrollTop(0);
    $('.main').scrollTop(0);
    $("#" + id).show();
    $("#" + oldId).hide();
}

function hideOverlay(id, oldId) {
    if (config.debug) { console.log('HideOverlay'); }
    //$(document).scrollTop(0);
    $('.main').scrollTop(0);
    $("#" + id).hide();
    $("#" + oldId).show();
}

function showFull(containerDiv, position) {
    //console.log(containerDiv);
    $('#pictureShow img').attr('src', $('img', containerDiv).attr('src'));
    $('#pictureShowDelete').attr('data-position', position);
    $('#pictureShow').css('height', getHeight() + 'px');
    $('#pictureShow').css('width', getWidth() + 'px');
    $('#pictureShow').show();
}

function closePictureShow() {
    $('#pictureShow').hide();
}

function onDeleteClaimPicture() {
    var position = $('#pictureShowDelete').attr('data-position');
    claimWizard.removeImage(position);
    $('#pictureShow').hide();
}

function deleteClaimPicture() {
    showConfirm(dataCache.dictionary.get(window.app.culture).Claim_DeletePicture, onDeleteClaimPicture);
}

function splitImage(imageBase64) {
    var blocSize = 16000;
    var blocs = (imageBase64.length % blocSize == 0) ? (imageBase64.length / blocSize) : (imageBase64.length / blocSize) + 1;
    var split = [];
    for (var i = 0; i < blocs; i++) {
        split[i] = imageBase64.substr(i * blocSize, blocSize);
    }
    return split;
}

function showLoading() {
    $('section').css('height', $(window).height() + 'px');
    $('section').css('width', $(window).width() + 'px');

    hideSpinner();
    app.isLoading = true;
    if (config.debug) { console.log("Show Loading"); }
    
    // showSpinner();
    $('#floatingLoadingGif').show();
}
function hideLoading() {
    app.isLoading = false;
    if (config.debug) {
        console.log("Hide Loading");
    }

    // hideSpinner();
    $('#floatingLoadingGif').hide();
}

function showSpinner() {
    $("#ajax-spinner").show();
}
function hideSpinner() {
    $("#ajax-spinner").hide();
}

var alertRead = {
    _cacheKey: "AlertsReadList",
    updateReadList: function(alerts) {
        var list = alertRead.readAlertsList();

        for (var i = 0; i < alerts.length; i++) {
            if ($.inArray(alerts[i].navId, list) == -1) {
                list.push(alerts[i].navId);
            }
        }

        window.localStorage.setItem(alertRead._cacheKey + window.app.currentProfile.id, JSON.stringify(list));

        _nbOfUreadAlerts = null;
    },
    readAlertsList: function() {
        if (window.app.currentProfile) {
            var list = window.localStorage.getItem(alertRead._cacheKey + window.app.currentProfile.id);
            if (list) {
                return JSON.parse(list);
            }
        }

        return [];
    },
    _nbOfUreadAlerts: null,
    nbOfUreadAlerts: function() {
        if (alertRead._nbOfUnreadAlerts) {
            return alertRead._nbOfUnreadAlerts;
        }

        // Calculate unread alerts #
        var list = alertRead.readAlertsList();
        var alerts = dataCache.alerts.get(app.culture);
        var count = 0;
        if (alerts) {
            for (var i = 0; i < alerts.length; i++) {
                if ($.inArray(alerts[i].navId, list) == -1) {
                    count++;
                }
            }
        }

        alertRead._nbOfUreadAlerts = count;

        return count;
    }
};

// Apparently IE still doesn't have the Array.prototype.indexOf method
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) { return i; }
        }
        return -1;
    };
}

// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}

function formatDate(value) {
    if (!/Invalid|NaN/.test(new Date(value))) {
        // console.log('original: ' + value + ' - new: ' + parseDate(value));

        return moment(parseDate(value)).format('YYYY-MM-DD');
    }
    else if (isNaN(Number(value))) {
        var date = moment(value, 'YYYY-MM-DD');

        return date.format('YYYY-MM-DD');
    }
        
    return value;
}

function getCurrentDate() {
    return moment(new Date()).format('YYYY-MM-DD');
}

function showAlert(text, callback) {
    if (isOnDevice()) {
        navigator.notification.alert(
            text,
            callback,
            dataCache.dictionary.get(window.app.culture).Common_AlertTitle, 
            dataCache.dictionary.get(window.app.culture).Common_OK); 
    } else {
        alert(text);
    }
}

function showConfirm(text, callback) {
    if (isOnDevice()) {
        navigator.notification.confirm(
            text,
            function (/*1-based index*/buttonIndex) {
                if (buttonIndex == 1/*OK*/) {
                    if (callback && typeof (callback) === "function") {
                        callback();
                    }
                }
            },
            dataCache.dictionary.get(window.app.culture).Common_Confirm,
            dataCache.dictionary.get(window.app.culture).Common_OK + ',' + dataCache.dictionary.get(window.app.culture).Common_Cancel);
    } else {
        if (confirm(text)) {
            if (callback && typeof (callback) === "function") {
                callback();
            }
        }
    }
}

function writeChunk(key, value) {
    if (isOnDevice()) 
    {
        // showAlert("writeChunk");
        var filePath = key + ".txt";

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            // showAlert("fileSystem");
            fileSystem.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
                // showAlert("fileEntry");
                fileEntry.createWriter(function (writer) {
                    // showAlert("createwriter");
                    writer.truncate(0);
                    writer.onwriteend = function (evt) {
                        // showAlert("writevalue");
                        writer.write(value);
                        writer.onwriteend = null;
                    };               
                }, function (error) { if (config.debug) { showAlert("fail createwriter: " + error.code); } });
            }, function (error) { if (config.debug) { showAlert("fail fileEntry: " + error.code); } });
        }, function (error) { if (config.debug) { showAlert("fail fileSystem: " + error.code); } });
    }
    else{
        window.localStorage.setItem(key, value);
    }
}

function readChunk(key, callback) {
    if (isOnDevice()) 
    {
        try {
            //showAlert("readChunk");
            var filePath = key + ".txt";

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                //showAlert("fileSystem");
                fileSystem.root.getFile(filePath, { create: true }, function (fileEntry) {
                    //showAlert("fileEntry");
                    fileEntry.file(function (file) {
                        //showAlert("file: " + filePath);

                        try {

                            var FileReader = cordova.require('cordova/plugin/FileReader');
                            var reader = new FileReader();

                            reader.onloadend = function (evt) {
                                //showAlert("data");
                                try {
                                    if (callback && typeof (callback) === "function") {
                                        //evt.target.result
                                        callback(evt.target.result);
                                    }
                                }
                                catch (ex) {
                                    if (config.debug) {
                                        showAlert("onloadend catch: " + ex);
                                    }
                                    callback(null);
                                }
                            };

                            reader.onerror = function (error) {
                                if (config.debug) {
                                    try {
                                        showAlert("Reader error:" + error.target.error);
                                    } catch (ex) { showAlert("reader.onerror catch: " + ex); }
                                }
                                callback(null);
                            };

                            // showAlert("FileReader Required");

                            // showAlert("FileReader var");
                            //reader.onloadstart = function () {
                            //    showAlert("load Start");
                            //};

                            // showAlert("FileReader Before Read");
                            reader.readAsText(file);
                            // callback(reader.result);
                            // showAlert("FileReader After Read");
                        }
                        catch (ex) {
                            if (config.debug) {
                                showAlert("file reader catch: " + ex);
                            }
                            callback(null);
                        }
                    }, function (error) { if (config.debug) { showAlert("fail file: " + error.code); } callback(null); });
                }, function (error) { if (config.debug) { showAlert("fail fileEntry: " + error.code); } callback(null); });
            }, function (error) { if (config.debug) { showAlert("fail fileSystem: " + error.code); } callback(null); });


        }
        catch (ex) {
            if (config.debug) {
                showAlert("file reader catch: " + ex);
            }
            callback(null);
        }
    }
    else
    {
        if (callback && typeof (callback) === "function") {
            callback(window.localStorage.getItem(key));
        }
    }
}

function fail(error) {
    if (config.debug) {
        console.log(error.code);
    }
    else {
        showAlert("fail: " + error.code);
    }
}

function isOnDevice() {
    if (navigator.platform == 'Win32')
    {
        return false;
    }

    return navigator.notification;
}

function checkHideStatusBar() {
    // hide status bar for older than ios7
    if (isOnDevice()) {
        if (device && device.version.substring(0, 1) < 7) {
            $(".status-bar").hide();
        }
    } else {
        $(".status-bar").hide();
    }
}