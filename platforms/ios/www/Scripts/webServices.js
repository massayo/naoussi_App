/// <reference path="app.js" />
/// <reference path="~/config.js" />
/// <reference path="libs/base.js" />

var dataCacheEntry = Class.extend({
    data: null,
    lastUpdate: new Date(1901, 01, 01),
    init: function (d, l) {
        this.data = d;
        this.lastUpdate = l;
    }
});

var dataCacheEntryAccessor = Class.extend({
    key: '',
    init: function (k) {
        this.key = k;
    },
    getKey: function (cultureCode) {
        return 'dataCache-' + this.key + '-' + cultureCode;
    },
    getEntry: function (cultureCode) {
        var k = this.getKey(cultureCode);

        var data = window.localStorage.getItem(k);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    },
    get: function (cultureCode) {
        var entry = this.getEntry(cultureCode);

        if (entry) {
            return entry.data;
        }

        return null;
    },
    set: function (cultureCode, data) {
        var k = this.getKey(cultureCode);
        var entry = this.getEntry(cultureCode);

        if (!entry) {
            entry = new dataCacheEntry(data, new Date());
        }

        entry.lastUpdate = new Date();
        entry.data = data;

        window.localStorage.setItem(k, JSON.stringify(entry));
    },
    isOld: function (cultureCode) {
        var entry = this.getEntry(cultureCode);

        if (entry) {
            if (!window.app.isOnline) {
                return false;
            }

            var secondsOld = ((new Date()).getTime() - new Date(entry.lastUpdate).getTime()) / 1000;
            return secondsOld > config.dataExpirationSeconds;
        }

        return true; 
    }
});

var dataCacheEntryAccessorById = Class.extend({
    key: '',
    init: function (k) {
        this.key = k;
    },
    getKeyId: function (cultureCode, id) {
        return 'dataCache-' + this.key + '-' + cultureCode + '-' + id;
    },
    getEntry: function (cultureCode, id) {
        var k = this.getKeyId(cultureCode, id);

        var data = window.localStorage.getItem(k);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    },
    get: function (cultureCode, id) {
        var entry = this.getEntry(cultureCode, id);

        if (entry) {
            return entry.data;
        }

        return null;
    },
    set: function (cultureCode, id, data) {
        var k = this.getKeyId(cultureCode, id);
        var entry = this.getEntry(cultureCode, id);

        if (!entry) {
            entry = new dataCacheEntry(data, new Date());
        }

        entry.lastUpdate = new Date();
        entry.data = data;

        window.localStorage.setItem(k, JSON.stringify(entry));
    },
    cleanup: function () {
        var idKey = 'dataCache-' + this.key;
        var toCleanup = [];
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);            
            if (key.slice(0, idKey.length) === idKey) {
                toCleanup[toCleanup.length] = key;
            }
        }

        for (var i = 0; i < toCleanup.length; i++) {
            window.localStorage.removeItem(toCleanup[i]);
        }
    },
    isOld: function (cultureCode, id) {
        // Check is offline
        if (!window.app.isOnline) {
            return false;
        }

        var entry = this.getEntry(cultureCode, id);

        if (entry) {
            var secondsOld = ((new Date()).getTime() - new Date(entry.lastUpdate).getTime()) / 1000;
            return secondsOld > config.dataExpirationSeconds;
        }

        return true;
    }
});

var dataCache = {
    dictionary: new dataCacheEntryAccessor('dictionary'),
    provinces: new dataCacheEntryAccessor('provinces'),
    provinceAssociations: new dataCacheEntryAccessor('provinceAssociations'),
    associations: new dataCacheEntryAccessor('associations'),
    getStartedImages: new dataCacheEntryAccessor('getStartedImages'),
    applicationData: new dataCacheEntryAccessor('applicationData'),
    associationData: new dataCacheEntryAccessorById('associationData'),
    uiContentsData: new dataCacheEntryAccessor('uiContentsData'),
    claimHistoryData: new dataCacheEntryAccessorById('claimHistoryData'),
    alerts: new dataCacheEntryAccessor('alertsData')
};

var webServices = {
    endpoints: null,
    // GetData
    initialized: false,
    getConfigData: function (url, data, callback) {
        var timer = new Date();
        $.ajax({
            url: config.webservices.baseUrl + config.webservices.applicationService + url,  //+ '?callback=?',
            data: data,
            success: function (sData) {
                if (config.debug) { console.log('getConfigData (' + url + '): Success ' + (new Date() - timer)); }
                callback(sData);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                if (config.debug) { console.log("ERROR: XMLHttpRequest=" + xmlHttpRequest.responseText + "\ntextStatus=" + textStatus + "\nerrorThrown=" + errorThrown + " timer=" + (new Date() - timer)); }

                // Rollback screen
                if (app.isLoading) {
                    hideLoading();
                    //$('#defaultContent').show();
                    //window.app.currentScreen = window.app.previousScreen;                    
                    //$('#' + window.app.currentScreen.containerId).show();
                }

                callback(null);
            },
            dataType: 'json', // 'jsonp',
            contentType: "application/json; charset=utf-8",
            type: 'GET',
            timeout: config.timeout * 10
        });
    },
    getData: function (url, data, callback, errorCallback) {
        if (!this.initialized) {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }

        var timer = new Date();
        if (config.debug) { console.log(url + ': calling...'); }
        if (!data) { data = {}; }

        data.applicationCultureCode = window.app.culture;

        $.ajax({
            url: config.webservices.baseUrl + url, // + '?callback=?',
            data: data,
            success: function (sData) {
                if (config.debug) {
                    console.log(url + ': success ' + (new Date() - timer));
                }
                if (callback && typeof (callback) === "function") {
                    callback(sData);
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                hideSpinner();

                if (config.debug) {
                    console.log(url + ': error' + (new Date() - timer));
                    console.log("ERROR: XMLHttpRequest=" + xmlHttpRequest.responseText + "\ntextStatus=" + textStatus + "\nerrorThrown=" + errorThrown);
                }

                // Rollback screen
                if (app.isLoading) {
                    hideLoading();
                    window.app.currentScreen = window.app.previousScreen;
                    $('#' + window.app.currentScreen.containerId).show();
                }

                var errorObj = (typeof xmlHttpRequest.responseText === 'undefined')
                    ? { message: errorThrown }
                    : $.parseJSON(xmlHttpRequest.responseText);
                
                if (errorCallback && typeof (errorCallback) === "function") {
                    errorCallback(errorObj);
                } else {
                    // Alert
                    errorView.show(errorObj);
                }
            },
            dataType: 'json', // 'jsonp',
            contentType: "application/json; charset=utf-8",
            type: 'GET',
            timeout: config.timeout
        });
    },
    postData: function (url, data, callback, errorCallback) {
        if (!this.initialized) {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }

        var timer = new Date();
        if (config.debug) { console.log(url + ': calling...'); }
        if (!data) { data = {}; }

        $.ajax({
            url: config.webservices.baseUrl + url,
            data: JSON.stringify(data),
            success: function (sData) {
                if (config.debug) {
                    console.log(url + ': success ' + (new Date() - timer));
                }
                if (callback && typeof (callback) === "function") {
                    callback(sData);
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                hideSpinner();

                if (config.debug) {
                    console.log(url + ': error ' + (new Date() - timer));
                    console.log("ERROR: XMLHttpRequest=" + xmlHttpRequest.responseText + "\ntextStatus=" + textStatus + "\nerrorThrown=" + errorThrown);
                }

                // Rollback screen
                if (app.isLoading) {
                    //hideLoading();
                    window.app.currentScreen = window.app.previousScreen;
                    //window.app.currentScreen.show();
                }

                var errorObj = (typeof xmlHttpRequest.responseText === 'undefined')
                    ? { message: errorThrown }
                    : $.parseJSON(xmlHttpRequest.responseText);

                if (errorCallback && typeof (errorCallback) === "function") {
                    errorCallback(errorObj);
                } else {
                    // Alert
                    errorView.show(errorObj);
                }
            },
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            timeout: config.timeout
        });
    },
    versionCheck: null,
    checkVersion: function (callback) {
        this.getConfigData(config.webservices.checkVersion, { version: config.version }, function (data) {
            webServices.versionCheck = data;
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        });
    },
    getEndpoints: function (callback) {
        var thisObject = this;
        this.getConfigData(config.webservices.getEndpoints, { version: config.version }, function (data) {
            if (data) {
                thisObject.endpoints = data;
                thisObject.initialized = true;
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            }
        });
    },
    getApplicationData: function (callback) {
        if (!this.initialized) {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }

        var cultureCode = window.app.culture;

        if (dataCache.applicationData.get(cultureCode) && !dataCache.applicationData.isOld(cultureCode)) {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.applicationData.get(cultureCode));
            }

            return;
        }

        if (window.app.isOnline) {
            this.getData(this.endpoints['GetApplicationData'], { cultureCode: cultureCode, brand: config.brand }, function (data) {
                dataCache.applicationData.set(cultureCode, data);

                if (data) {
                    dataCache.provinces.set(cultureCode, data.provinces);
                    dataCache.provinceAssociations.set(cultureCode, data.provinceAssociations);
                    dataCache.associations.set(cultureCode, data.associations);
                }

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.applicationData.get(cultureCode));
                }
            });
        }
        else {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }
    },
    getAssociationData: function (associationId, callback) {
        if (!this.initialized) {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }

        var cultureCode = window.app.culture;

        if (dataCache.associationData.get(cultureCode, associationId) && !dataCache.associationData.isOld(cultureCode, associationId)) {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.associationData.get(cultureCode, associationId));
            }
            return;
        }

        if (window.app.isOnline) {
            this.getData(this.endpoints['GetAssociationData'], { associationId: associationId, cultureCode: cultureCode }, function (data) {
                dataCache.associationData.cleanup();
                dataCache.associationData.set(cultureCode, associationId, data);

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.associationData.get(cultureCode, associationId));
                }
            });
            return;
        }
        else {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }
    },
    getStartedImages: function (callback) {
        var cultureCode = window.app.culture;
        if (dataCache.getStartedImages.get(cultureCode) == null || dataCache.getStartedImages.isOld(cultureCode)) {
            this.getData(this.endpoints['GetStartedImages'], { cultureCode: cultureCode, brand: config.brand }, function (data) {
                dataCache.getStartedImages.set(cultureCode, data);

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.getStartedImages.get(cultureCode));
                }
            });
        }
        else {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.getStartedImages.get(cultureCode));
            }
        }
    },
    // Get Provinces
    getProvinces: function (callback) {
        var cultureCode = window.app.culture;
        if (dataCache.provinces.get(cultureCode) == null || dataCache.provinces.isOld(cultureCode)) {
            this.getData(this.endpoints['GetProvinces'], { cultureCode: cultureCode }, function (data) {
                dataCache.provinces.set(cultureCode, data);

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.provinces.get(cultureCode));
                }
            });
        }
        else {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.provinces.get(cultureCode));
            }
        }
    },
    // Get Associations
    getAssociations: function (callback) {
        var cultureCode = window.app.culture;
        if (dataCache.associations.get(cultureCode) == null || dataCache.associations.isOld(cultureCode)) {
            this.getData(this.endpoints['GetAssociations'], { cultureCode: cultureCode, brand: config.brand }, function (data) {
                dataCache.associations.set(cultureCode, data);

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.associations.get(cultureCode));
                }
            });
        } else {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.associations.get(cultureCode));
            }
        }
    },
    getDictionary: function (cultureCode, callback) {
        if (this.endpoints == null) {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }

            return;
        }

        if (dataCache.dictionary.get(cultureCode) == null || dataCache.dictionary.isOld(cultureCode)) {
            this.getData(this.endpoints['GetDictionary'], { cultureCode: cultureCode }, function (data) {
                dataCache.dictionary.set(cultureCode, data);

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.dictionary.get(cultureCode));
                }
            });
        }
        else {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.dictionary.get(cultureCode));
            }
        }
    },
    // Get Benefits
    getBenefits: function (cultureCode, associationId, callback) {
        this.getAssociationData(associationId, function (data) {
            if (callback && typeof (callback) === "function") {
                if (data) {
                    callback(data.benefitItems);
                }
                else {
                    callback(null);
                }
            }
        });
    },
    getUiContents: function (callback) {
        if (!this.initialized) {
            if (callback && typeof (callback) === "function") {
                callback(null);
            }
            return;
        }

        var cultureCode = window.app.culture;

        if (dataCache.uiContentsData.get(cultureCode) && !dataCache.uiContentsData.isOld(cultureCode)) {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.uiContentsData.get(cultureCode));
            }

            return;
        }

        this.getData(this.endpoints['GetUiContents'], { cultureCode: cultureCode }, function (data) {
            dataCache.uiContentsData.set(cultureCode, data);

            if (callback && typeof (callback) === "function") {
                callback(dataCache.uiContentsData.get(cultureCode));
            }
        });
    },
    getClaimHistory: function (profile, forceRefresh, callback) {
        if (!this.initialized || !profile) {
            callback(null);
            return;
        }

        var studentId = profile.studentId;
        var studentEmail = profile.email;
        var profileId = profile.id;

        if (!forceRefresh || !app.isOnline) {
            // Using config.defaultCultureCode because even if the user changes its culturecode, the claim history is the same
            if (dataCache.claimHistoryData.get(config.defaultCultureCode, profileId) && !dataCache.claimHistoryData.isOld(config.defaultCultureCode, profileId)) {
                if (callback && typeof (callback) === "function") {
                    callback(dataCache.claimHistoryData.get(config.defaultCultureCode, profileId));
                }

                return;
            }
        }

        if (forceRefresh)
        {
            app.forceReloadClaimHistory = false;
        }

        var thisObject = this;
        this.validateToken(profile,
            // Valid Token
            function () {
                thisObject.getData(thisObject.endpoints['GetClaimHistory'], { studentId: studentId, studentEmail: studentEmail, token: profile.token }, function (data) {

                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            data.date = formatDate(data.date);
                        }
                    }

                    dataCache.claimHistoryData.set(config.defaultCultureCode, profileId, data);

                    if (callback && typeof (callback) === "function") {
                        callback(dataCache.claimHistoryData.get(config.defaultCultureCode, profileId));
                    }
                });
            },
            // Invalid token
            function () {                
                // logout
                window.app.screens.mainMenu.executeLogout(true);
            }
        );
    },
    sendForgotPasswordRequest: function (cultureCode, email, callback) {
        this.getData(this.endpoints['SendForgotPasswordRequest'], { email: email, cultureCode: cultureCode, brand: config.brand }, function (data) {
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        });
    },
    resendDirectDepositMessage: function (callback) {
        var model =
        {
            id: window.app.currentProfile.id,
            associationId: window.app.currentProfile.associationId,
            email: window.app.currentProfile.email,
            cultureCode: window.app.culture,
            brand: config.brand
        };
        this.postData(this.endpoints['ResendDirectDepositMessage'], model, function (data) {
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        });
    },
    validateLogin: function (email, password, callback) {
        this.getData(this.endpoints['ValidateProfileLogin'], { email: email, password: password },
            function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data, false);
                }
            },
            function (errorObj) {
                if (errorObj && errorObj.message == "LockedAccount") {
                    if (callback && typeof (callback) === "function") {
                        callback(null, true);
                    }
                }
                else {
                    errorView.show(errorObj);
                }
            }
        );
    },
    createProfile: function (profile, callback, errorCallback) {
        this.postData(this.endpoints['CreateProfile'], profile, function (data) {
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        }, errorCallback);
    },
    updateProfile: function (oldStudentId, oldEmail, profile, callback) {
        var thisObject = this;
        var newStudentId = profile.studentId;
        profile.studentId = oldStudentId;
        var newEmail = profile.email;
        profile.email = oldEmail;
        this.validateToken(profile, function () {
            profile.studentId = newStudentId;
            profile.email = newEmail;
            thisObject.postData(thisObject.endpoints['UpdateProfile'], profile, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    createDependent: function (dependent, callback) {
        dependent.token = window.app.currentProfile.token;
        var thisObject = this;
        var profile = window.app.currentProfile;
        this.validateToken(profile, function () {
            thisObject.postData(thisObject.endpoints['CreateDependent'], dependent, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    updateDependent: function (dependent, callback) {
        dependent.token = window.app.currentProfile.token;
        var thisObject = this;
        var profile = window.app.currentProfile;
        this.validateToken(profile, function () {
            thisObject.postData(thisObject.endpoints['UpdateDependent'], dependent, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    deleteDependent: function (dependentId, profile, callback) {
        var thisObject = this;
        this.validateToken(profile, function () {
            thisObject.postData(thisObject.endpoints['DeleteDependent'], { id: dependentId, studentId: profile.studentId, studentEmail: profile.email, token: profile.token }, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    createClaim: function (claimInfo, callback) {
        var thisObject = this;
        claimInfo.token = window.app.currentProfile.token;
        var profile = window.app.currentProfile;
        this.validateToken(profile, function () {
            thisObject.postData(thisObject.endpoints['CreateClaim'], claimInfo, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            hideSpinner();
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    createClaimFile: function (claimId, filename, callback, errorCallback) {
        this.postData(this.endpoints['CreateFile'], { claimId: claimId, filename: filename }, function (data) {
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        }, errorCallback);
    },
    appendClaimFile: function (fileId, fileData, callback, errorCallback) {

        if (config.debug) {
            console.log("fileId: " + fileId);
            console.log("fileData: " + fileData);
        }

        this.postData(this.endpoints['AppendFile'], { fileId: fileId, data: fileData }, function (data) {
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        }, errorCallback);
    },
    submitClaim: function (claimId, callback) {
        this.postData(this.endpoints['SubmitClaim'], { claimId: claimId, filename: '', brand: config.brand }, function (data) {
            if (callback && typeof (callback) === "function") {
                callback(data);
            }
        });
    },
    createInsurer: function (insurer, callback) {
        var thisObject = this;
        insurer.token = window.app.currentProfile.token;
        var profile = window.app.currentProfile;
        this.validateToken(profile, function () {
            thisObject.postData(thisObject.endpoints['CreateInsurer'], insurer, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    updateInsurer: function (insurer, callback) {
        var thisObject = this;
        insurer.token = window.app.currentProfile.token;
        var profile = window.app.currentProfile;
        this.validateToken(profile, function () {
            thisObject.postData(thisObject.endpoints['UpdateInsurer'], insurer, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    deleteInsurer: function (id, profile, callback) {
        var thisObject = this;
        this.validateToken(profile, function () {
            thisObject.getData(thisObject.endpoints['DeleteInsurer'], { id: id, studentId: profile.studentId, studentEmail: profile.email, token: profile.token }, function (data) {
                if (callback && typeof (callback) === "function") {
                    callback(data);
                }
            });
        },
        function () {
            // logout
            window.app.screens.mainMenu.executeLogout(true);
        });
    },
    // Get Alerts
    getAlerts: function (associationId, callback) {
        var cultureCode = window.app.culture;
        if (app.isOnline && (dataCache.alerts.get(cultureCode) == null || dataCache.alerts.isOld(cultureCode))) {
            this.getData(this.endpoints['GetAlertsData'], { associationId: associationId, cultureCode: cultureCode }, function (data) {
                dataCache.alerts.set(cultureCode, data);

                if (callback && typeof (callback) === "function") {
                    callback(dataCache.alerts.get(cultureCode));
                }
            });
        }
        else {
            if (callback && typeof (callback) === "function") {
                callback(dataCache.alerts.get(cultureCode));
            }
        }
    },
    // Validate Token
    validateToken: function (profile, validCallback, invalidCallback) {
        this.getData(this.endpoints['ValidateToken'], { studentId: profile.studentId, studentEmail: profile.email, token: profile.token }, function (data) {
            if (config.debug)
            {
                console.log("Validate token: " + data);
            }
            if (data) {
                if (validCallback && typeof (validCallback) === "function") {
                    validCallback();
                }
            }
            else {
                if (invalidCallback && typeof (invalidCallback) === "function") {
                    invalidCallback();
                }
            }
        });
    }
}