import { $$, $, browser, by, element, protractor } from 'protractor';
import { MerchUtility } from '../MerchUtility';
let config = require('./../../../config'),
    merchConfig = require('./../config');

let merchUtility = new MerchUtility();
let url: any;
let merchantBaseUrl = config.merchantBaseUrl;

class ApplicationUtility {
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
        browser.sleep(2000);
        merchUtility.enterPinCode(this.loginData.pin);
        browser.sleep(3000);
        let apps = element(by.xpath('//div[@class="side-menu"]/div[4]/a'));
        browser.actions().mouseMove(apps).perform();
        apps.click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toBe(merchantBaseUrl + 'dashboard/sales-channels/applications');
    };

    listApps(option: any) {
        this.beforEach(option.merchState);
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('sales-channels/applications');

        let datePicker = $('.date-filter');
        datePicker.click();
        //this.filterWithDate(merchConfig.date.fromDate);
        //this.filterWithToDate(merchConfig.date);

        this.filterAppChart(option);

        let dateFilter = datePicker.getText();
        $$('.analytics').each(function (elem, index) {
            let chartDate = elem.getText();
            expect(chartDate).toContain(dateFilter);
        });
        //api documentation
    };

    addApp(option: string, loginData?) {
        let data = {
            appState: 'add',
            imagePath: merchConfig.imagePath.path1,
            title: merchUtility.generateRandString(),
            description: merchUtility.generateRandString(),
            password: merchUtility.generateRandString()
        }
        if (loginData) {
            this.beforEach(option, loginData);
        } else {
            this.beforEach(option);
        }
        browser.sleep(1000);
        if (option === 'sidemenu') {
            element(by.xpath('//div[@class="side-menu"]/div[4]/a[1]/div[1]/img')).click();
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
        expect(browser.getCurrentUrl()).toContain('applications/add');
        this.appStructure(data);
        browser.sleep(1000);        
        expect(browser.getCurrentUrl()).toContain('addedTestApp=true');
        element(by.xpath('//div[@class="btn btn--white-green btn--smaller"]')).click();
        browser.sleep(1000);
        element(by.xpath('//div[@class="side-menu"]//div[4]//div[1]//a[1]')).getText().then(function(text){
            data.title = merchUtility.upperFirstChar(data.title);
            expect(text).toContain(data.title);
        });
        let dashApp = element(by.xpath('//business-dashboard/div[@class="dashboard"]/div[@class="dashboard-content"]/business-sales-channels/business-applications/div[@class="box"]/div/div/div[1]/div[2]/div[1]')).getText();
        expect(browser.getCurrentUrl()).toContain('sales-channels/applications');
        expect(dashApp).toContain(data.title);
    };

    appStructure(data: any) {
        if (data.appState === 'add') {
            $('[id="title"]').sendKeys(data.title);
            $('[id="description"]').sendKeys(data.description);
            $('[id="password"]').sendKeys(data.password);
            merchUtility.uploadImage(data.imagePath);
            element(by.xpath('//div[@class="btn btn--green btn--smaller"]')).click();
        } else {
            $('[id="title"]').clear();
            $('[id="title"]').sendKeys(data.title);
            $('[id="description"]').clear();
            $('[id="description"]').sendKeys(data.description);
            $('[id="password"]').sendKeys(data.password);
            data.appId = $('[id="appId"]').getText();
            merchUtility.uploadImage(data.imagePath);
            element(by.xpath('//button[@class="btn btn--green btn--smaller"]')).click();
        }
        merchUtility.enterPinCode(this.loginData.pin);
    };

    editApp(options: string) {
        let data = {
            appId: '',
            appState: 'edit',
            imagePath: merchConfig.imagePath.path2,
            title: merchUtility.generateRandString(),
            description: merchUtility.generateRandString(),
            password: merchUtility.generateRandString()
        }
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
        expect(browser.getCurrentUrl()).toContain('applications/edit');
        this.appStructure(data);
        browser.sleep(1000);
        element(by.xpath('//div[@class="side-menu"]/div[4]/div[1]/a[1]/div[1]')).getText().then(function(text){
            data.title = merchUtility.upperFirstChar(data.title);
            expect(text).toContain(data.title);
        });
        expect(browser.getCurrentUrl()).toContain('applications/details');
        expect(browser.getCurrentUrl()).toContain(data.appId);
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
        
    }
    
    filterWithToDate(date:any){
        let toDateMonth = $('div.bs-datepicker.date-range__container div.bs-datepicker-container div.bs-calendar-container bs-days-calendar-view.bs-datepicker-multiple:nth-child(2) bs-calendar-layout:nth-child(1) div.bs-datepicker-head bs-datepicker-navigation-view:nth-child(1) button.current:nth-child(2) > span:nth-child(1)');
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
    }

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

    filterAppChart(option: any){
        if (option.filter === 'sales') {
            $$('div.analytics__filter:nth-child(1)').each(function (elem, index) {
                elem.click();
            });
        } else if (option.filter === 'requests') {
            $$('div.analytics__filter:nth-child(2)').each(function (elem, index) {
                elem.click();
            });
        } else {
            $$('div.analytics__filter:nth-child(3)').each(function (elem, index) {
                elem.click();
            });
        }
    };

    getApiDoc(){
        browser.getWindowHandle().then(function(parentGUID){
            element(by.xpath('//a[@class="btn btn--api-doc"]')).click();
			browser.sleep(1000);
			browser.getAllWindowHandles().then(function(allGUID){
				for(let guid of allGUID){
					if(guid !=parentGUID){
                        browser.switchTo().window(guid);
                        expect(browser.getCurrentUrl()).toContain('vapulus-3rd-party-api-doc');
						break;
					}
                }
            });
        });
    };

    appDetail(option:any){
        let sideSelector , dashSelector ;
        this.beforEach(option.merchState);
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('sales-channels/applications');
        browser.sleep(1000);
        if(option === 'sidemenu'){
            sideSelector = element(by.xpath('//div[@class="side-menu"]/div[4]/div[1]/a[1]'));
            browser.executeScript("arguments[0].scrollIntoView(true);", sideSelector);

            browser.actions().mouseDown(sideSelector).perform();
            sideSelector.click();
        }else{
            dashSelector = 'div.dashboard:nth-child(2) div.dashboard-content:nth-child(2) div.box div.row.item-row:nth-child(1) div.col-lg-12.col-xl-4:nth-child(2) div.item-details a.item-details__link:nth-child(5) div.item-details__link__info > div.item-details__title';
            $(dashSelector).click();
        }
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('applications/details/');
        
        $('.date-filter').click();
        //this.filterWithDate(merchConfig.date.fromDate);
        //this.filterWithToDate(merchConfig.date);

        this.filterAppChart(option);

        let dateFilter = $('.date-filter').getText();
        $$('.analytics').each(function (elem, index) {
            let chartDate = elem.getText();
            expect(chartDate).toContain(dateFilter);
        });

        this.showAppPassword();

        this.showAppHash();

        this.changeStateApp('details');
    }

    showAppPassword(){
        $('div.dashboard:nth-child(2) div.dashboard-content:nth-child(2) div.box div.row.item-row div.col-lg-12.col-xl-4:nth-child(2) div.item-details div.item-details__info-box:nth-child(8) div:nth-child(5) > div.link.item-details__info-item').click();
        merchUtility.enterPinCode(merchConfig.data.pin);
    }

    showAppHash(){
        $('div.dashboard:nth-child(2) div.dashboard-content:nth-child(2) div.box div.row.item-row div.col-lg-12.col-xl-4:nth-child(2) div.item-details div.item-details__info-box:nth-child(8) div:nth-child(6) > div.link.item-details__info-item').click();
        merchUtility.enterPinCode(merchConfig.data.pin);
    }

    changeStateApp(state : string){
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

    transactionDetails(type : string,option : any){
        this.beforEach(option.merchState);
        browser.sleep(1000);
        //filter (app - website - store)
        if(type === 'app'){
            $('div.dashboard:nth-child(2) div.dashboard-content:nth-child(2) div.box div.row.item-row:nth-child(1) div.col-lg-12.col-xl-4:nth-child(2) div.item-details a.item-details__link:nth-child(5) div.item-details__link__info > div.item-details__title').click();
        }else if(type === 'website'){

        }else{

        }
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

    appLog(option:string){
        this.beforEach('');
        browser.sleep(1000);
        if(option === 'dashboard'){
            element(by.xpath('//business-sales-channels//business-applications//div[@class="box"]//div//div//div[1]//div[2]//div[1]//a[2]//div[2]//a[1]')).click();
            browser.sleep(3000);
        }else{
            element(by.xpath('//div[@class="item-details__title"]')).click();
            browser.sleep(1000);
            $('div.dropdown-box').click();
            element(by.xpath('//div[@class="dropdown-content"]/a[1]')).click().then(function(){
                browser.sleep(3000);
            });
        }
        //filter with keyWord
        this.keywordFilter(merchConfig.appLogFilter.keyWord,'log');
        browser.sleep(3000);
       
        let searchInput = element(by.xpath('//input[@placeholder="Search in logs"]'));
        searchInput.clear();
        searchInput.sendKeys(protractor.Key.ENTER);
        browser.sleep(3000);

        //advanced filter
        element(by.xpath(('//button[@class="btn btn--margin-left filter__item-btn btn--white-green"]'))).click();
        this.appLogAdvancedFilter(merchConfig.appLogFilter);
        browser.sleep(3000);
        element(by.xpath('//button[@class="btn btn--margin-left filter__item-btn btn--white filters-btn"]')).getText().then(function(text){
            expect(text).toContain('Filters applied');
        });
        element(by.xpath('//button[@class="btn btn--margin-left filter__item-btn btn--white filters-btn"]')).click();
        element(by.xpath('//span[@class="filters-box__actions__clear"]')).click().then(function(){
            element(by.xpath('//div[@class="btn btn--green btn--smaller"]')).click();    
            browser.sleep(3000);
        });
        
        //filter with date
        element(by.xpath('//div[@class="date-filter date-filter--bigger"]//input[1]')).click();
        this.filterWithDate(merchConfig.date.fromDate);
        element(by.xpath('//div[@class="date-filter date-filter--bigger"]//input[2]')).click();
        this.filterWithDate(merchConfig.date.toDate);
    }

    appLogAdvancedFilter(filters:any){
        $('div.filters-box__heading').getText().then(function(text){
            expect(text.toString()).toContain('Filter application log');
        });
        $('[id="api"]').click();
        // select api 
        element.all(by.xpath('//option')).then(function(apis){
            apis.forEach(api=>{
                browser.actions().mouseDown().perform();
                api.getText().then(function(text){
                    if(text.includes(filters.api)){
                        api.click();
                    }
                });
            });
        });
        //select status
        $('#status').click();
        element.all(by.xpath('//option')).then(function(apis){
            apis.forEach(api=>{
                browser.actions().mouseDown().perform();
                api.getText().then(function(text){
                    if(text.includes(filters.status)){
                        api.click();
                    }
                });
            });
        });
        //other elements
        $('#transactionId').sendKeys(filters.transactionId);
        $('#userId').sendKeys(filters.userId);
        $('#cardId').sendKeys(filters.cardId);
        element(by.xpath('//div[@class="btn btn--green btn--smaller"]')).click();

    }

    changeStateFromEdit(){
        this.beforEach('');
        browser.sleep(1000);
        element(by.xpath('//div[@class="item-details"]/a[1]')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('applications/edit');
        this.changeStateApp('edit');
    }

}
export { ApplicationUtility };