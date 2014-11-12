var config = {
    version: '2.1',
    defaultCultureCode: 'en-CA',
    loadingText: 'Loading...',
    refreshText: 'Sorry! A connection error has occurred. <br /> Please click the button to reload.',
    mustUpdateText: ' is out of date. You must update the application to continue.',
    webservices: {
        baseUrl: 'https://m.aseq.com', 
        applicationService: '/ApplicationWebService.svc',
        checkVersion: '/CheckValidVersion',
        claimingService : '/ClaimingWebService.svc',
        getEndpoints: '/GetEndpoints'
    },
    debug: false,
    showOnlineStatus: false,
    timeout: 20000,
    dataExpirationSeconds: 600,
    brand: 'ihaveaplan' // 'santeetudiante' - 'ihaveaplan'
}