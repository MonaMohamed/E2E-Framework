import { $$, $, browser, by, element, protractor } from 'protractor';
import { MerchUtility } from '../merchant/MerchUtility';
let merchConfig = require('./../merchant/config');
let config = require('./../../config');
let loginData: any;
let url: any;
let SignUpData: any;
let userBaseUrl = config.userBaseUrl,
    merchantBaseUrl = config.merchantBaseUrl,
    adminBaseUrl = config.adminBaseUrl;

const merchUtility = new MerchUtility();
export class Utility {
    deleteCookies = () => {
        browser.driver.manage().deleteAllCookies;
    };

    login = (data) => {
        this.deleteCookies();

        if (data.on == 'merchant') {
            url = merchantBaseUrl;
            loginData = config.merchant;
            merchUtility.login(url, loginData);
            merchUtility.enterPinCode(loginData.pin);
            browser.sleep(3000);
            expect(browser.driver.getCurrentUrl()).toContain('dashboard/guide');
        } else if (data.on == 'user') {
            url = userBaseUrl;
            loginData = config.user;
        }
        else {
            url = adminBaseUrl;
            loginData = config.admin;
        }
    };

    resetPassword = (data) => {
        this.deleteCookies();
        if (data.on == 'merchant') {
            url = merchantBaseUrl;
            loginData = merchConfig.data;
            merchUtility.resetPassword(url);
            expect(browser.driver.getCurrentUrl()).toBe(url + data.destUrl);
            loginData.password = merchConfig.data.newPassword;
            merchUtility.login(url, loginData);
        } else if (data.on == 'user') {
            url = userBaseUrl;
            loginData = config.user;
        }
        else {
            url = adminBaseUrl;
            loginData = config.admin;
        }
    };

    resetPinCode = (data) => {
        this.deleteCookies();
        if (data.on == 'merchant') {
            url = merchantBaseUrl;
            loginData = merchConfig.data;
            merchUtility.resetPinCode(url);
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl()).toBe(url + data.destUrl);
            merchUtility.login(url, loginData);
            browser.sleep(3000);
            merchUtility.createPinCode();

        } else if (data.on == 'user') {
            url = userBaseUrl;
            loginData = config.user;
        }
        else {
            url = adminBaseUrl;
            loginData = config.admin;
        }
    };

    generateRandomPhone = function () {
        return Math.ceil(Math.random() * (999999999 - 123456789) + 123456789);
    };

    setCurrentState = function (cb?) {
        browser.getCurrentUrl().then(function (url) {
            let res = url.split('/')[url.split('/').length - 1];
            if (cb) cb(res);
        });
    };

    SignUp = (data, cb?) => {
        this.deleteCookies();
        if (data.on == 'merchant') {
            url = merchantBaseUrl;
            SignUpData = config.SignUpMerchant;
            merchUtility.SignUpFirstStep(url, SignUpData);
            merchUtility.SignUpSecondStep(SignUpData);
            merchUtility.createPinCode();

            // expect(browser.getCurrentUrl()).toBe(url + data.destUrl);

        } else if (data.on == 'user') {
            url = userBaseUrl;
            loginData = config.user;
        }
        else {
            url = adminBaseUrl;
            loginData = config.admin;
        }

        if (cb) cb(SignUpData);
    };
}


