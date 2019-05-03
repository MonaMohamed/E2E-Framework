import {Utility} from './../../common/utility';
import { browser } from 'protractor';
const utility = new Utility;


describe('Login App', ()=> {
    beforeEach(function () {
        var originalTimeout;
    
        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 360000;
            browser.restart();
        });
    
        afterEach(function() {
          jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
          utility.deleteCookies();
          browser.sleep(2000);
        });
    });
    
    it('Existing merchant login app', () => {
        var data = {
            on : 'merchant',
            destUrl:'dashboard-guide'
        };
        utility.login(data);
    });

    it('Existing merchant forget password', () => {
        var data = {
            on : 'merchant',
            destUrl:'resetpassword'
        };
       utility.resetPassword(data);
    });

    it('Existing merchant reset pincode',()=>{
        var data = {
            on: 'merchant',
            destUrl:'login'
        };
        utility.resetPinCode(data);
    });

    xit('Login with wrong password',()=>{

    });
});
