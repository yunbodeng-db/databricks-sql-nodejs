"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SaslPackageFactory_1 = require("./helpers/SaslPackageFactory");
var KerberosTcpAuthentication = /** @class */ (function () {
    function KerberosTcpAuthentication(options, authProcess) {
        var _a, _b, _c;
        this.username = ((_a = options) === null || _a === void 0 ? void 0 : _a.username) || 'anonymous';
        this.password = ((_b = options) === null || _b === void 0 ? void 0 : _b.password) !== undefined ? (_c = options) === null || _c === void 0 ? void 0 : _c.password : 'anonymous';
        this.authProcess = authProcess;
    }
    KerberosTcpAuthentication.prototype.authenticate = function (transport) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.authProcess.init({
                password: _this.password,
                username: _this.username,
            }, function (error, client) {
                if (error) {
                    return reject(error);
                }
                var onError = function (err) {
                    transport.end();
                    reject(err);
                };
                var onSuccess = function () {
                    transport.removeListener('connect', onConnect);
                    transport.removeListener('data', onData);
                    resolve(transport);
                };
                var onConnect = function () {
                    _this.onConnect(transport).catch(onError);
                };
                var onData = function (data) {
                    var status = data[0];
                    if (status === SaslPackageFactory_1.StatusCode.OK) {
                        _this.nextTransition(transport, data).catch(onError);
                    }
                    else if (status === SaslPackageFactory_1.StatusCode.COMPLETE) {
                        onSuccess();
                    }
                    else {
                        var message = data.slice(5).toString();
                        onError(new Error('Authentication error: ' + message));
                    }
                };
                transport.connect();
                transport.addListener('connect', onConnect);
                transport.addListener('data', onData);
                transport.addListener('error', onError);
            });
        });
    };
    KerberosTcpAuthentication.prototype.onConnect = function (transport) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.START, Buffer.from(KerberosTcpAuthentication.AUTH_MECH)));
            _this.authProcess.transition('', function (err, token) {
                if (err) {
                    return reject(err);
                }
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(token || '', 'base64')));
                resolve();
            });
        });
    };
    KerberosTcpAuthentication.prototype.nextTransition = function (transport, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var payload = data.slice(5).toString('base64');
            _this.authProcess.transition(payload, function (err, response) {
                if (err) {
                    return reject(err);
                }
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(response || '', 'base64')));
                resolve();
            });
        });
    };
    KerberosTcpAuthentication.AUTH_MECH = 'GSSAPI';
    return KerberosTcpAuthentication;
}());
exports.default = KerberosTcpAuthentication;
//# sourceMappingURL=KerberosTcpAuthentication.js.map