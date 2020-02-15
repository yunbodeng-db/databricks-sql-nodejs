const TCLIService = require('./thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('./thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('./dist/HiveClient').default;
const HiveDriver = require('./dist/hive/HiveDriver').default;
const NoSaslAuthentication = require('./dist/connection/auth/NoSaslAuthentication').default;
const PlainTcpAuthentication = require('./dist/connection/auth/PlainTcpAuthentication').default;
const PlainHttpAuthentication = require('./dist/connection/auth/PlainHttpAuthentication').default;
const KerberosTcpAuthentication = require('./dist/connection/auth/KerberosTcpAuthentication').default;
const KerberosHttpAuthentication = require('./dist/connection/auth/KerberosHttpAuthentication').default;
const MongoKerberosAuthProcess = require('./dist/connection/auth/helpers/MongoKerberosAuthProcess').default;
const HttpConnection = require('./dist/connection/connections/HttpConnection').default;
const TcpConnection = require('./dist/connection/connections/TcpConnection').default;
const HiveUtils = require('./dist/utils/HiveUtils').default;

module.exports = {
    HiveClient,
    HiveDriver,
    HiveUtils,
    auth: {
        helpers: {
            MongoKerberosAuthProcess
        },
        NoSaslAuthentication,
        PlainTcpAuthentication,
        PlainHttpAuthentication,
        KerberosTcpAuthentication,
        KerberosHttpAuthentication,
    },
    connections: {
        HttpConnection,
        TcpConnection
    },
    thrift: {
        TCLIService,
        TCLIService_types
    }
};