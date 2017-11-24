'use strict';

angular.module('copayApp.services').factory('fingerprintService', function($log, gettextCatalog, configService, platformInfo) {
    var root = {};

    var _isAvailable = false;

    if (platformInfo.isCordova && !platformInfo.isWP) {
        window.plugins.touchid = window.plugins.touchid || {};
        window.plugins.touchid.isAvailable(
            function(msg) {
                _isAvailable = 'IOS';
            },
            function(msg) {
                FingerprintAuth.isAvailable(function(result) {
                    //TODO fingerprint
                    if (result.isAvailable)
                        _isAvailable = 'ANDROID';
                    //_isAvailable = false;
                }, function() {
                    _isAvailable = false;
                });
            });
    };

    var requestFinger = function(cb) {
        try {
            var encryptConfig = {
                clientId: 'bitchk.com',
                disableBackup: true
                    // dialogTitle: "sss",
                    // dialogMessage: "xxxx",
                    // dialogHint: "bbb"
            };
            //TODO not work withBackup is true....
            FingerprintAuth.encrypt(encryptConfig,
                function(result) {
                    if (result.withFingerprint || result.withBackup) {
                        $log.info('Finger OK');
                        return cb();
                    } else if (result.withPassword) {
                        $log.info("Finger: Authenticated with backup password");
                        return cb();
                    } else if (result.withBackup) {
                        result.withFingerprint = true;

                        $log.info("Finger: Authenticated with backup");
                        return cb();
                    } else {

                        return cb(gettextCatalog.getString('Finger Scan Failed Unkown Method'));
                    }
                },
                function(msg) {

                    $log.info('Finger Failed:' + JSON.stringify(msg));
                    return cb(gettextCatalog.getString('Finger Scan Failed'));
                }
            );
        } catch (e) {

            $log.warn('Finger Scan Failed:' + JSON.stringify(e));
            return cb(gettextCatalog.getString('Finger Scan Failed'));
        };
    };


    var requestTouchId = function(cb) {
        try {
            window.plugins.touchid.verifyFingerprint(
                gettextCatalog.getString('Scan your fingerprint please'),
                function(msg) {
                    $log.debug('Touch ID OK');
                    return cb();
                },
                function(msg) {
                    $log.debug('Touch ID Failed:' + JSON.stringify(msg));
                    return cb(gettextCatalog.getString('Touch ID Failed'));
                }
            );
        } catch (e) {
            $log.debug('Touch ID Failed:' + JSON.stringify(e));
            return cb(gettextCatalog.getString('Touch ID Failed'));
        };
    };

    var isNeeded = function(client) {
        if (!_isAvailable) return false;
        if (client === 'unlockingApp') return true;

        var config = configService.getSync();
        config.touchIdFor = config.touchIdFor || {};

        return config.touchIdFor[client.credentials.walletId];
    };

    root.isAvailable = function(client) {
        return _isAvailable;
    };

    root.check = function(client, cb) {
        if (isNeeded(client)) {
            $log.debug('FingerPrint Service:', _isAvailable);
            if (_isAvailable == 'IOS')
                return requestTouchId(cb);
            else {
                //TODO finger
                return requestFinger(cb);
                //return cb();
            }
        } else {
            return cb();
        }
    };

    return root;
});