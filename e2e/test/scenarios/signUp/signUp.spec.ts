import { browser } from 'protractor';
import {MerchUtility} from './../../merchant/MerchUtility';
const merchUtility = new MerchUtility;
let config = require('../../../../e2e/config.js');
let merchConfig = require('./../../merchant/config.js');
let SignUpData = config.SignUpMerchant;
let merchantBaseUrl = config.merchantBaseUrl;
let url = merchantBaseUrl


describe('Sign up new merchant account', () => {
    beforeEach(function () {
        var originalTimeout;
        
        browser.manage().window().maximize();
        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 360000;
        });
    
        afterEach(function() {
          jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
    });
    
    it('sign up 1st step', () => {
        SignUpData.on = 'merchant';
        merchUtility.SignUpFirstStep(url,SignUpData);
    });

    it('sign up 2nd step', () => {
        SignUpData.on = 'merchant';
        merchUtility.SignUpSecondStep(SignUpData);
    });

    xit('create pin code', () => {
        merchUtility.createPinCode();
    });

});