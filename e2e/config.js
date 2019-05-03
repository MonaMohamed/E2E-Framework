var random = require(__dirname + '/test/common/random')
var conf = require('./protractor.conf').config,

    env = {
        env: 'local',
        URLs: {
            merchantBaseUrl: 'http://localhost:4200/',
            userBaseUrl: '',
            adminBaseUrl: ''
        },
        merchant: {
            userName: 'merchop',
            password: '123456',
            pin: '0000'
        },
        user: {
            userName: 'mona01',
            password: '123456',
            pin: '0000'
        },
        admin: {
            userName: 'admin2',
            password: '123456',
            pin: '0000'
        },
        SignUpMerchant: {
            //*/
            userName: 'e2e' + random.number(0,999),
            password:'123456',
            email:'e2e'+random.number(0,999) + '@vap.com',
            pin:'0000',
            firstName: 'e2eFN' + random.number(0,999),
            lastName: 'e2eLN' + random.number(0,999),
            mobileNumber: '' + random.number(0, 100000000000),
            code:'555555'

        },


    };

switch (conf.params.env.name || env.env) {
    case 'front':
        env.URLs = {
            merchantBaseUrl: '',
            userBaseUrl: '',
            adminBaseUrl: ''
        };
        break;
    case 'local':
        env.URLs = {
            merchantBaseUrl: 'http://localhost:4200/',
            userBaseUrl: '',
            adminBaseUrl: ''
        };
        break;
    case 'production':
        env.URLs = {
            merchantBaseUrl: '',
            userBaseUrl: '',
            adminBaseUrl: ''
        };
        env.merchant.userName = 'monaa';
        env.merchant.password = '1234567';
        break;
    case 'test':
        env.URLs = {
            merchantBaseUrl: 'https://test.vapulus.com/',
            userBaseUrl: '',
            adminBaseUrl: ''
        };
        env.merchant.userName = 'monaa';
        env.merchant.password = '1234567';
        break;
};
module.exports = {
    userBaseUrl: env.URLs.userBaseUrl,
    merchantBaseUrl: env.URLs.merchantBaseUrl,
    adminBaseUrl: env.URLs.adminBaseUrl,

    merchant: env.merchant,
    user: env.user,
    admin: env.admin,
    SignUpMerchant: env.SignUpMerchant
};