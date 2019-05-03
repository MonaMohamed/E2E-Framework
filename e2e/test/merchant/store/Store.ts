import { $$, $, browser, by, element, protractor, Key } from 'protractor';
import { MerchUtility } from '../MerchUtility';
var random = require('../../common/random');

let config = require('./../../../config'),
    merchConfig = require('./../config');

let merchUtility = new MerchUtility();
let url: any;
let merchantBaseUrl = config.merchantBaseUrl;

class Store {

    merchUtility = new MerchUtility();
    loginData: any;
    url: any;
    merchantBaseUrl = config.merchantBaseUrl;


    beforEach(merchState: string, loginData?) {
        url = merchantBaseUrl;

        if (merchState === 'new') {
            if (loginData) {
                this.loginData = loginData;
            } else {
                this.loginData = merchConfig.newMerch;
            }
        } else {
            this.loginData = merchConfig.loginData;
        }
        merchUtility.login(url, this.loginData);
        browser.sleep(1000);
        merchUtility.enterPinCode(this.loginData.pin);
        browser.sleep(3000);
        let stores = element(by.xpath('//div[@class="side-menu"]/div[2]/a'));
        stores.click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toBe(merchantBaseUrl + 'dashboard/sales-channels/stores');
    };

    addStore(option: string, loginData?) {
        let data = {
            title: merchUtility.generateRandString(),
            description: merchUtility.generateRandString(),
            posID: merchUtility.generateRandString(),
            posID2: merchUtility.generateRandString(),
            location: merchConfig.storeData.location1,
            phoneNumber: merchUtility.generateRandomPhone(),
            phoneNumber2: merchUtility.generateRandomPhone(),
            email: 'e2e' + random.number(0, 999) + '@vap.com',
            email2: 'e2e' + random.number(0, 999) + '@vap.com',
            imagePath: merchConfig.imagePath.path1
        };

        if (loginData) {
            this.beforEach(option, loginData);
        } else {
            this.beforEach(option);
        }
        if (option === 'sidemenu') {
            element(by.xpath('//div[@class="side-menu"]/div[2]/a[1]/div[1]/img')).click();
        }
        if (option === 'dashboard') {
            element(by.xpath('//a[@class="btn btn--green btn--smaller btn--no-margin-right"]')).click();
        }
        if (option === 'new') {
            element(by.xpath('//a[@class="btn btn--green btn--smaller btn--no-margin-left"]')).click();
        }
        expect(browser.getCurrentUrl()).toContain('stores/add');
        this.addStoreData(data);
        browser.sleep(3000);
        element(by.xpath('//div[@class="side-menu"]//div[2]//div[1]//a[1]')).getText().then(function (text) {
            data.title = merchUtility.upperFirstChar(data.title);
            expect(text).toContain(data.title);
        });
        let dashStore = element(by.xpath('//business-stores/div[@class="box"]/div/div/div[1]/div[2]/div[1]')).getText();
        expect(browser.getCurrentUrl()).toContain('sales-channels/stores');
        expect(dashStore).toContain(data.title);
    };

    editStore(options: string){
        let data = {
            title: merchUtility.generateRandString(),
            description: merchUtility.generateRandString(),
            posID: merchUtility.generateRandString(),
            posID2: merchUtility.generateRandString(),
            location: merchConfig.storeData.location2,
            phoneNumber: merchUtility.generateRandomPhone(),
            phoneNumber2: merchUtility.generateRandomPhone(),
            email: 'e2e' + random.number(0, 999) + '@vap.com',
            email2: 'e2e' + random.number(0, 999) + '@vap.com',
            imagePath: merchConfig.imagePath.path2
        };

        this.beforEach('');
        if (options === 'dashboard') {
            element(by.xpath('//div[@class="item-details"]/a[1]')).click();
        }
        if (options === 'details') {
            element(by.xpath('//div[@class="item-details"]')).click();
            element(by.xpath('//div[@class="item-details"]/a[1]')).click();
        }
        expect(browser.getCurrentUrl()).toContain('stores/edit');
        this.editStoreData(data);
        browser.sleep(3000);
        element(by.xpath('//div[@class="side-menu"]/div[2]/div[1]/a[1]/div[1]')).getText().then(function(text){
            let title = merchUtility.upperFirstChar(data.title);
            expect(text).toContain(title);
        });
        expect(browser.getCurrentUrl()).toContain('stores/details');
        element(by.xpath('//div[@class="item-details"]')).getText().then(function(text){
            expect(text).toContain(data.title);
            expect(text).toContain(data.description);
            expect(text).toContain(data.email);
            expect(text).toContain(data.posID);
        });
    };

    addStoreData(data:any){
        browser.waitForAngularEnabled(false);
        $('[id="name"]').sendKeys(data.title);
        $('[id="description"]').sendKeys(data.description);
        
        browser.executeScript('window.scrollTo(0,160);').then(function () {
            $('[id="posID"]').sendKeys(data.posID);
            element(by.xpath('//div[contains(text(),"Add POS ID")]')).click();
            $('[id="posID0"]').sendKeys(data.posID2);
        });

        $('[id="map-input"]').sendKeys(data.location);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        $('[id="phoneNumber"]').sendKeys(data.phoneNumber);
        element(by.xpath('//div[contains(text(),"Add Phone number")]')).click();
        $('[id="phoneNumber0"]').sendKeys(data.phoneNumber2);
        $('[id="email"]').sendKeys(data.email);

       // element(by.xpath('//div[contains(text(),"Add Email")]')).click();
        // browser.executeScript('window.scrollTo(0,397);').then(function () {
        //     email.click();
        // });
        //$('[id="email0"]').sendKeys(data.email2);
        merchUtility.uploadImage(data.imagePath);
        element(by.xpath('//button[@class="btn btn--green btn--smaller"]')).click();
        merchUtility.enterPinCode(this.loginData.pin);
    };

    editStoreData(data:any){
        browser.waitForAngularEnabled(false);
        let title = $('[id="name"]');
        title.clear();
        title.sendKeys(data.title);
        var until = protractor.ExpectedConditions;
        let description = $('[id="description"]');
        browser.wait(until.presenceOf(description), 1000, 'Element taking too long to appear in the DOM');
        description.clear();
        description.sendKeys(data.description);
        let posId = $('[id="posID"]');
        posId.clear();
        posId.sendKeys(data.posID);
        let posId2 = $('[id="posID0"]');
        posId2.clear();
        posId2.sendKeys(data.posID2);
        let location = $('[id="map-input"]');
        location.clear();
        location.sendKeys(data.location);
        browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        let mobile1 = $('[id="phoneNumber"]');
        mobile1.clear();
        mobile1.sendKeys(data.phoneNumber);
        let mobile2 = $('[id="phoneNumber0"]');
        mobile2.clear();
        mobile2.sendKeys(data.phoneNumber2);
        let email = $('[id="email"]');
        email.clear();
        email.sendKeys(data.email);
        merchUtility.uploadImage(data.imagePath);
        element(by.xpath('//div[@class="btn btn--green btn--smaller"]')).click();
        merchUtility.enterPinCode(this.loginData.pin);
    };

    listStores(option: any) {
        this.beforEach(option.merchState);
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('sales-channels/stores');

        $('.date-filter').click();
        //this.filterWithDate(merchConfig.date.fromDate);
        //this.filterWithToDate(merchConfig.date);

        this.filterStoreChart(option);

        let dateFilter = $('.date-filter').getText();
        $$('.analytics').each(function (elem, index) {
            let chartDate = elem.getText();
            expect(chartDate).toContain(dateFilter);
        });        
    };

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
        let toDateMonth = $('div.bs-datepicker.date-range__container div.bs-datepicker-container div.bs-calendar-container bs-days-calendar-view.bs-datepicker-multiple:nth-child(2) bs-calendar-layout:nth-child(1) div.bs-datepicker-head bs-datepicker-navigation-view:nth-child(1) > button.current:nth-child(2)');
        toDateMonth.getText().then(function(text){
            let i = 12;
            while(i >= 0){
                if(text.toString() === date.toDate.month){
                    break; 
                }
                $('div.bs-datepicker.theme-default div.bs-datepicker-container div.bs-calendar-container bs-days-calendar-view.bs-datepicker-multiple:nth-child(2) bs-calendar-layout:nth-child(1) div.bs-datepicker-head bs-datepicker-navigation-view:nth-child(1) button.next:nth-child(4) > span:nth-child(1)').click();
                i--;
            } 
        });
        //next toDate day
        this.getDay(date.toDate.day);
    };

    filterStoreChart(option: any){
        if (option.filter === '0') {
            $$('div.analytics__filter:nth-child(1)').each(function (elem, index) {
                elem.click();
            });
        } else if (option.filter === '1') {
            $$('div.analytics__filter:nth-child(2)').each(function (elem, index) {
                elem.click();
            });
        } else if (option.filter === '2'){
            $$('div.analytics__filter:nth-child(3)').each(function (elem, index) {
                elem.click();
            });
        }else{
            $$('div.analytics__filter:nth-child(4)').each(function (elem, index) {
                elem.click();
            });
        }
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

    storeDetail(option:any){
        let sideSelector , dashSelector ;
        this.beforEach(option.merchState);
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('sales-channels/stores');
        browser.sleep(1000);
        if(option === 'sidemenu'){
            sideSelector = element(by.xpath('//div[@class="side-menu"]/div[2]/div[1]/a[1]'));
            browser.executeScript("arguments[0].scrollIntoView(true);", sideSelector);

            browser.actions().mouseDown(sideSelector).perform();
            sideSelector.click();
        }else{
            dashSelector = 'div.dashboard:nth-child(2) div.dashboard-content:nth-child(2) div.box div.row.item-row:nth-child(1) div.col-lg-12.col-xl-4:nth-child(2) div.item-details a.item-details__link > div.item-details__title.item-details__title--more-margin'
            $(dashSelector).click();
        }
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('stores/details/');
        
        $('.date-filter').click();
        //this.filterWithDate(merchConfig.date.fromDate);
        //this.filterWithToDate(merchConfig.date);

        this.filterStoreChart(option);

        let dateFilter = $('.date-filter').getText();
        $$('.analytics').each(function (elem, index) {
            let chartDate = elem.getText();
            expect(chartDate).toContain(dateFilter);
        });

        this.changeStoreState('details');
    }

    changeStoreState(state : string){
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

    transactionDetails(option : any){
        this.beforEach(option.merchState);
        browser.sleep(1000);
        element(by.xpath('//div[@class="side-menu"]/div[2]/div[1]/a[1]')).click();
        //filter with keyword
        option = Object.assign(option,merchConfig.searchData);
        this.keywordFilter(option.keyWord,'details');
        browser.sleep(1000);
        let searchInput = element(by.xpath('//input[@placeholder="Search in transactions"]'));
        browser.actions().mouseMove(searchInput).perform();
        searchInput.clear();
        searchInput.sendKeys(protractor.Key.ENTER);
        browser.sleep(1000);
        //click advance filter
        this.transactionsAdvancedFilter(option);
        
        
    }

    transactionsAdvancedFilter(option : any){
        let advanceBtn =element(by.xpath('//button[@class="btn btn--margin-left filter__item-btn btn--white-green"]'));
        browser.actions().mouseMove(advanceBtn).perform();

        advanceBtn.click();
        element(by.xpath('//div[@class="filters-box__heading"]')).getText().then(function(text){
            expect(text.toString()).toContain('Filter transactions log');
        });

        //filter with status
        element(by.xpath('//select[@id="status"]')).click();
        element.all(by.xpath('//option')).each(function(elem,index){
             elem.getAttribute('value').then(function(value){
               if(option.status === value){
                   elem.click();
               }
             });
        });

        //filter with merchantuser
        if(!option.user.includes('All')){
            element(by.xpath('//div[@class="input-style input-style--ul-list dropdown"]')).click();
            element(by.xpath('//input[@placeholder="Search users"]')).click();
            element(by.xpath('//input[@placeholder="Search users"]')).sendKeys(option.user);
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            browser.sleep(1000);
            element.all(by.xpath('//li')).then(function(elems){
                var flag = false;
                var i = 0;
            selectRightUser();
            function selectRightUser(){
                var selecteduser = elems[i];
                selecteduser.getText().then(function (text) {
                    if (text.includes(option.user)) {
                        flag = true;
                        selecteduser.click();
                    } else
                        i++;
                    if (i < elems.length && !flag)
                    selectRightUser();
                });
            } 
           });
        }
        //apply filter
        element(by.xpath('//div[@class="btn btn--green btn--smaller popup-box__btn"]')).click();
        element(by.xpath('//button[@class="btn btn--margin-left filter__item-btn btn--white filters-btn"]')).getText().then(function(text){
            expect(text.toString()).toContain('Filters applied');
        })

        $('div.table__body__row').isPresent().then(function(res){
            if(res){
                $$('div.table__body__row').each(function(elem,index){
                    elem.getText().then(function(text){
                        expect(text.toString()).toContain(option.user);
                    });
                });
            }else{
                $('div.no-content').getText().then(function(text){
                    expect(text.toString()).toContain('No data or no result for your search');
                })
            }
        });
    }


    keywordFilter(keyWord:string,state : string){
        let searchInput ;
        if(state === 'details'){
            searchInput = element(by.xpath('//input[@placeholder="Search in transactions"]'));
            browser.actions().mouseMove(searchInput).perform();
        }else{
            searchInput = element(by.xpath('//input[@placeholder="Search in logs"]'));
        }
        searchInput.sendKeys(keyWord);
        
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        
        $('div.table__body__row').isPresent().then(function(res){
            if(res){
                $$('div.table__body__row').each(function(elem,index){
                    elem.getText().then(function(text){
                         expect(text.toString()).toContain(keyWord);
                    });
                });
            }else{
                $('div.no-content').getText().then(function(text){
                    expect(text.toString()).toContain('No data or no result for your search');
                })
            }
        });
    }
}
export { Store };