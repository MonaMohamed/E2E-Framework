import { $$, $, browser, by, element, protractor, logging } from 'protractor';
let config = require('./config');
const path = require('path');

class MerchUtility {
    loginData: any;
    SignUpData: any;

    login = (url: any, loginData: any) => {
        url = url + 'login';
        this.loginData = loginData;
        browser.get(url).then(function(){
            $('[id="vapulusId"]').sendKeys(loginData.userName);
            $('[id="password"]').sendKeys(loginData.password);
            $('.btn').click().then(function(){
                browser.sleep(2000);
            });
        });
    };

    enterPinCode = (pin: any) => {
        let pinCode: any;
        var lockScreen = $('[id="pincodeContainer"]');
        lockScreen.isPresent().then(function () {
            expect(lockScreen.getText()).toContain('Enter PIN code');
        });
        pinCode = pin;
        $$('.keypad-button').then(function (buttons) {
            for (var i = 0; i < 4; i++) {
                var pin = pinCode[i];
                buttons.forEach(btn => {
                    btn.getText().then(function (text) {
                        if (pin.toString() == text){
                            btn.click();
                        }  
                    });
                });
            }
        });
        browser.sleep(2000);
    };

    createPinCode = () => {
        let newPin = config.data.newpin;
        var lockScreen = element(by.xpath('//div[@id="pincodeContainer"]'));
        lockScreen.isPresent().then(function () {
            expect(lockScreen.getText()).toContain('Create PIN code');
        });
        $$('.keypad-button').then(function (buttons) {
            for (var i = 0; i < 4; i++) {
                var pin = newPin[i];
                buttons.forEach(btn => {
                    btn.getText().then(function (text) {
                        if (pin.toString() == text)
                            btn.click();
                    });
                });
            }
        });
        $('[id="save"]').click();
        browser.driver.sleep(1000);
        this.enterPinCode(newPin);
    };

    resetPassword = (url: any) => {
        this.loginData = {};
        url = url + 'resetpassword';

        browser.get(url);
        $('[id="vapulusId"]').sendKeys(config.data.userName);

        element(by.xpath("//div[@class='input-style input-style--login input-style--left-section input-style--phone']")).click();
        element(by.xpath("//input[@formcontrolname='searchCountry']")).sendKeys(config.data.country);
        browser.sleep(1000);
        element(by.xpath('//div[@class="phone-number__countries"]/div[1]')).click();

        $('[id="phoneNum"]').sendKeys(config.data.mobileNumber || this.generateRandomPhone());

        element(by.xpath('//button[@type="submit"]')).click();
        browser.sleep(1000);
        browser.waitForAngularEnabled(false);
        element.all(by.xpath('//input[@type="number"]')).each(function (elm, index) {
            elm.sendKeys(config.data.code[index] || '5');
        }).then(function(){
            $('[id="validate"]').click();
            browser.sleep(1000);
        });
       
        let newPass = element(by.xpath('//div[@class="h6 text--steel resetPassword-heading"]'));
        newPass.getText().then(function(text){
            expect(text).toContain('Create a new password to your Vapulus account');
            $('[id="newPassword"]').sendKeys(config.data.newPassword);
            $('[id="repeatedPassword"]').sendKeys(config.data.newPassword);
        });
        element(by.xpath('//button[@type="submit"]')).click().then(function(){
            browser.sleep(2000);
        });
    };

    resetPinCode = (url: any) => {
        url = url + 'resetpincode'
        browser.get(url);
        let resetPin = element(by.xpath('//div[@class="h6 text--steel resetPincode-heading"]'));
        resetPin.getText().then(function(text){
            expect(text).toContain('You can reset your pincode using phone number');
            $('[id="password"]').sendKeys(config.data.password);
            element(by.xpath('//img[@class="input-icon input-icon--right input-icon--phone"]')).click();
            element(by.xpath("//input[@formcontrolname='searchCountry']")).sendKeys(config.data.country);
            browser.sleep(1000);
            element(by.xpath('//div[@class="phone-number__countries"]/div[1]')).click();

            $('[id="phoneNum"]').sendKeys(config.data.mobileNumber || this.generateRandomPhone());
            element(by.xpath('//button[@type="submit"]')).click();
        });
        
        let validate = element(by.xpath('//div[@class="paragraph"]'));
        validate.getText().then(function(text){
            expect(text).toContain('sent a six-digital code');
        });
        browser.waitForAngularEnabled(false);
        element.all(by.xpath('//input[@type="number"]')).each(function (elm, index) {
            elm.sendKeys(config.data.code[index] || '5');
        });
        $('[id="validate"]').click();
        
        browser.sleep(1000);
    };

    generateRandomPhone = function () {
        return Math.ceil(Math.random() * (999999999 - 123456789) + 123456789);
    };

    SignUpFirstStep = (url: any, SignUpData: any) => {
        url = url + 'signup';
        browser.get(url);
        this.SignUpData = SignUpData;

        //1st sign up step
        $('[id="emailAddress"]').sendKeys(SignUpData.email);
        $('[id="password"]').sendKeys(SignUpData.password);
        $('[id="userName"]').sendKeys(SignUpData.userName);
        $('[class="btn btn--orange"]').click();
        browser.sleep(3000);

        //accept agreement 
        var acceptBtn = element(by.xpath('//div[@class="btn btn--orange btn-accept-agreement"]'));
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
            browser.sleep(1000);
            acceptBtn.click();
        })
        browser.sleep(3000);

    };

    SignUpSecondStep = (SignUpData: any) => {

        this.SignUpData = SignUpData;
        //2nd sign up step 
        $('[id="firstName"]').sendKeys(SignUpData.firstName);
        $('[id="lastName"]').sendKeys(SignUpData.lastName);
        var countryDropList = element(by.xpath('/html/body/business-root/business-signup/div/div/div[2]/div/div[1]/form/div[2]/div[1]'));
        countryDropList.click();
        browser.sleep(1000);
        var countrySearch = element(by.xpath('/html/body/business-root/business-signup/div/div/div[2]/div/div[1]/form/div[2]/div[2]/form/input'));
        countrySearch.sendKeys('egypt');
        var selectedCountry = element(by.xpath('/html/body/business-root/business-signup/div/div/div[2]/div/div[1]/form/div[2]/div[2]/div[1]'));
        selectedCountry.click();
        $('[id="phoneNum"]').sendKeys(SignUpData.mobileNumber);
        //expect(element(by.css('class="error-msg"')).isPresent()).toBe(false);
        element(by.xpath('//div[@class="btn btn--orange"]')).click().then(function(){
            browser.sleep(2000);
        });
        // secondStepBtn.click().then(function(){
        //     //confirm mobile OTP code 
        //     browser.waitForAngularEnabled(false);
        //     element.all(by.xpath('//input[@type="number"]')).each(function (elm, index) {
        //         elm.sendKeys(config.data.code[index] || '5');
        //     }).then(function(){
        //         $('[id="validate"]').click();
        //         browser.sleep(1000);
        //         browser.waitForAngularEnabled(true);
        //     });
        // });
        // get facebook popup
        browser.getAllWindowHandles().then(function(handles){
            browser.waitForAngularEnabled(false);
            browser.switchTo().window(handles[1]).then(function(){
                element(by.xpath('//input[@name="phone_number"]')).getAttribute('value').then(function(val){
                    console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvv",val);
                    expect(val).toBe(SignUpData.mobileNumber);
                    browser.sleep(1000);
                    element(by.xpath('//button[@id="u_0_c"]')).click();
                });
            });
        });
    };

    generateRandString = function () {
        let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomstring = '';

        for (var i = 0; i < 10; i++)
            randomstring += charSet.charAt(Math.floor(Math.random() * charSet.length));

        return randomstring;
    };

    uploadImage(fileToUpload: string) {
        let absolutePath = path.resolve(__dirname, fileToUpload);
        $('.upload__file').sendKeys(absolutePath).then(function(){
            browser.sleep(1000);
            let upload = element(by.xpath('//a[@class="btn btn--med btn--green"]'));

            browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
                upload.click();
            });
            browser.sleep(3000);
        });
        $('.upload-thumbnail').isPresent().then(function(res){
            expect(res).toBe(true);
        });
    };

    upperFirstChar(str: string) {
        
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
}
export { MerchUtility };
