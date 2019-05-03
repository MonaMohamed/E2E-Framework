import { $$, $, browser, by, element, protractor } from 'protractor';
import { MerchUtility } from '../MerchUtility';
let config = require('./../../../config'),
    merchConfig = require('./../config');
import {Utility} from './../../common/utility';

let merchUtility = new MerchUtility();
let utility = new Utility();
let url: any;
let merchantBaseUrl = config.merchantBaseUrl;

class webSite {
    merchUtility = new MerchUtility();
    loginData: any;
    url: any;
    merchantBaseUrl = config.merchantBaseUrl;

    beforEach(merchState: string, loginData?) {
        url = merchantBaseUrl;

        if (merchState === 'new') {
            if (loginData) {
                this.loginData = loginData;
            }
        } else {
            this.loginData = merchConfig.loginData;
        }
        merchUtility.login(url, this.loginData);
        browser.sleep(1000);
        merchUtility.enterPinCode(this.loginData.pin);
        browser.sleep(1000);
        let websites = element(by.xpath('//div[@class="side-menu"]/div[3]/a'));
        browser.actions().mouseMove(websites).perform();
        websites.click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toBe(merchantBaseUrl + 'dashboard/sales-channels/websites');
    };

    addWebsite(option: string, loginData?) {
        let data = {
            webState: 'add',
            imagePath: merchConfig.imagePath.path1,
            title: merchUtility.generateRandString(),
            url: 'http://'+merchUtility.generateRandString()+'.com',  
        }
        if (loginData) {
            this.beforEach(option, loginData);
        } else {
            this.beforEach(option);
        }
        browser.sleep(1000);
        if (option === 'sidemenu') {
            element(by.xpath('//div[@class="side-menu"]/div[3]/a[1]/div[1]/img')).click();
            browser.sleep(1000);
        }
        if (option === 'dashboard') {
            element(by.xpath('//a[@class="btn btn--green btn--smaller btn--no-margin-right"]')).click();
            browser.sleep(1000);
        }
        if (option === 'new') {
            element(by.xpath('//a[@class="btn btn--green btn--smaller btn--no-margin-left"]')).click();
            browser.sleep(1000);
        }
        expect(browser.getCurrentUrl()).toContain('websites/add');
        this.websiteStructure(data);
        browser.sleep(1000);        
        element(by.xpath('//div[@class="side-menu"]//div[3]//div[1]//a[1]')).getText().then(function(text){
            data.title = merchUtility.upperFirstChar(data.title);
            expect(text).toContain(data.title);
        });
        let dashweb = element(by.xpath('//business-websites/div[@class="box"]/div/div/div[1]/div[2]/div[1]')).getText();
        expect(browser.getCurrentUrl()).toContain('sales-channels/websites');
        expect(dashweb).toContain(data.title);
    };

    websiteStructure(data: any) {
        if (data.webState === 'add') {
            $('[id="name"]').sendKeys(data.title);
            $('[id="url"]').sendKeys(data.url);
            merchUtility.uploadImage(data.imagePath);
            element(by.xpath('//div[@class="btn btn--green btn--smaller"]')).click();
        } else {
            $('[id="name"]').clear();
            $('[id="name"]').sendKeys(data.title);
            $('[id="link"]').clear();
            $('[id="link"]').sendKeys(data.url);
            merchUtility.uploadImage(data.imagePath);
            element(by.xpath('//button[@class="btn btn--green btn--smaller"]')).click();
        }
        merchUtility.enterPinCode(this.loginData.pin);
    };

    editWebsite(options: string){
        let data = {
            title: merchUtility.generateRandString(),
            url: 'http://'+merchUtility.generateRandString()+'.com',
            imagePath: merchConfig.imagePath.path2
        };

        this.beforEach('');
        browser.sleep(1000);
        if (options === 'dashboard') {
            element(by.xpath('//div[@class="item-details"]/a[1]')).click();
            browser.sleep(1000);
        }
        if (options === 'details') {
            element(by.xpath('//div[@class="item-details"]')).click();
            element(by.xpath('//div[@class="item-details"]/a[1]')).click();
            browser.sleep(1000);
        }
        expect(browser.getCurrentUrl()).toContain('websites/edit');
        this.websiteStructure(data);
        browser.sleep(1000);
        element(by.xpath('//div[@class="side-menu"]/div[3]/div[1]/a[1]/div[1]')).getText().then(function(text){
            data.title = merchUtility.upperFirstChar(data.title);
            expect(text).toContain(data.title);
        });
        expect(browser.getCurrentUrl()).toContain('websites/details');
    };

    websiteDetails(option : any){
        let webId;
        let sideSelector , dashSelector ;
        this.beforEach(option.merchState);

    
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('sales-channels/websites');
        browser.sleep(1000);
        if(option === 'sidemenu'){
            sideSelector = element(by.xpath('//div[@class="side-menu"]/div[3]/div[1]/a[1]'));
            browser.executeScript("arguments[0].scrollIntoView(true);", sideSelector);

            browser.actions().mouseDown(sideSelector).perform();
            sideSelector.click();
        }else{
            dashSelector = 'div.dashboard:nth-child(2) div.dashboard-content:nth-child(2) div.box div.row.item-row:nth-child(1) div.col-lg-12.col-xl-4:nth-child(2) div.item-details div.item-details__link.item-details__title:nth-child(6) > a.h4.link.link--black'
            $(dashSelector).click();
        }
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('websites/details/');
        
        $('.date-filter').click();
        this.filterWithDate(merchConfig.date.fromDate);
        this.filterWithToDate(merchConfig.date);

        this.filterWebsiteChart(option);

        let dateFilter = $('.date-filter').getText();
        $$('.analytics').each(function (elem, index) {
            let chartDate = elem.getText();
            expect(chartDate).toContain(dateFilter);
        });

        this.changeWebsiteState('details');
        
        //make sure copy button work fine
        utility.setCurrentState((id) => {
            webId = id;
        });

        browser.executeScript('window.scrollTo(0,300);').then(function () {
            var copy = element(by.xpath("//div[@class='link pull-right']"));
            copy.click();        
        }); 
        $('.code').getText().then(function (text) {
            expect($('.code').isDisplayed()).toBe(true);
            expect(text).toContain(webId);
        });  
    }

    filterWebsiteChart(option: any){
        if (option.filter === 'sales') {
            $$('div.analytics__filter:nth-child(1)').each(function (elem, index) {
                elem.click();
            });
        } else if (option.filter === 'clicks') {
            $$('div.analytics__filter:nth-child(2)').each(function (elem, index) {
                elem.click();
            });
        } else if (option.filter === 'views'){
            $$('div.analytics__filter:nth-child(3)').each(function (elem, index) {
                elem.click();
            });
        }else{
            $$('div.analytics__filter:nth-child(4)').each(function (elem, index) {
                elem.click();
            });
        }
    };

    changeWebsiteState(state : string){
        if(state === 'details'){
            $('business-toggle-checkbox.pull-right').click();
            merchUtility.enterPinCode(merchConfig.data.pin);
            $('business-toggle-checkbox.pull-right').getText().then(function(text){
                let state = text.toString();
                if(state.includes('ON')){
                    expect($('.test-bar').isDisplayed()).toBe(true);
                }
            });
        }else{ 
            let text1,text2 ;
            element(by.xpath('//div[@class="actions-footer"]/div[1]/div')).getAttribute('class').then(function(text){
                text1 = text;
                element(by.xpath('//div[@class="actions-footer"]/div[1]')).click();
                merchUtility.enterPinCode(merchConfig.data.pin);
            });
            
            element(by.xpath('//div[@class="actions-footer"]/div[1]/div')).getAttribute('class').then(function(text){
                text2 = text;
                if(text1 === 'btn btn--white-green btn--smaller'){
                    expect(text2).toBe('btn btn--white-red btn--smaller');
                }else{
                    expect(text2).toBe('btn btn--white-green btn--smaller');
                }
            });
        }
    }


    filterWithDate(date: any) {
        //get year
        this.getYear(date.year);
        browser.sleep(1000);
       //get month
       this.getMonth(date.month);
       browser.sleep(1000);
       //get day
       this.getDay(date.day);
       browser.sleep(3000);
       //next toDate Month
       
    };

    filterWithToDate(date:any){
        $('div.bs-datepicker.date-range__container div.bs-datepicker-container div.bs-calendar-container bs-days-calendar-view.bs-datepicker-multiple:nth-child(2) bs-calendar-layout:nth-child(1) div.bs-datepicker-head bs-datepicker-navigation-view:nth-child(1) button.current:nth-child(2) > span:nth-child(1)').click();
        //next toMonth month
        this.getMonth(date.toDate.month);
        //next toDate day
        this.getDay(date.toDate.day);
    };

    getDay(day:any){
        $$('table.days.weeks tbody tr td > span').then(function(days){
            var flag = false;
            var i = 0;
            selectRightDay();
            function selectRightDay(){
                var selectedDay = days[i];
                selectedDay.getText().then(function (text) {
                    if (text.toString() === day) {
                        flag = true;
                        selectedDay.click();
                    } else
                        i++;
                    if (i < days.length && !flag)
                    selectRightDay();
                });
            }   

        });
    };

    getMonth(month:any){
        $$('table.months tbody tr td > span').then(function (months) {
            var flag = false;
            var i = 0;
            selectRightMonth();

            function selectRightMonth() {
                var selectedMonth = months[i];
                selectedMonth.getText().then(function (text) {
                    if (text.toString() === month) {
                        flag = true;
                        selectedMonth.click();
                    } else
                        i++;
                    if (i < months.length && !flag)
                    selectRightMonth();
                });
            }
        });
    };

    getYear(year:any){
        $('bs-datepicker-navigation-view:nth-child(1) > button.current:nth-child(3)').click();
        $$('table.years tbody tr td > span').then(function (years) {
            var flag = false;
            var i = 0;
            selectRightYear();
            function selectRightYear() {
                var selectedYear = years[i];
                selectedYear.getText().then(function (text) {
                    if (text.toString() === year) {
                        flag = true;
                        selectedYear.click();
                    } else
                        i++;
                    if (i < years.length && !flag)
                    selectRightYear();
                });
            }
        });
    };


    // websiteClearFilter = () => {

    //     var filterPopup = element(by.xpath("//div[@class='filters-popup']"));
    //     filterPopup.isPresent().then(function () {
    //         element(by.xpath("//span[@class='filters-box__actions__clear']")).click();
    //     });
    // };

    listWebsites(option: any) {
        this.beforEach(option.merchState);
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('sales-channels/websites');

        $('.date-filter').click();
        //this.filterWithDate(merchConfig.date.fromDate);
        //this.filterWithToDate(merchConfig.date);

        this.filterWebsiteChart(option);

        let dateFilter = $('.date-filter').getText();
        $$('.analytics').each(function (elem, index) {
            let chartDate = elem.getText();
            expect(chartDate).toContain(dateFilter);
        });        
    };
}

export { webSite }

