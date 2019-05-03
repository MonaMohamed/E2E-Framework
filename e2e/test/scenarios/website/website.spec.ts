import { browser } from 'protractor';
import { webSite } from '../../merchant/webSite/webSite';
import { Utility } from './../../common/utility';
const utility = new Utility();
const website = new webSite();
let loginData: any

describe('Add Website', () => {
    beforeEach(function () {
        var originalTimeout;
        
        browser.manage().window().maximize();

        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 360000;
            browser.restart();
        });
    
        afterEach(function() {
          jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
          utility.deleteCookies();
        });
    });

    xit("existing merchant add new website from sidemenu",()=>{
        let option = 'sidemenu';
        website.addWebsite(option);
    });

    xit("existing merchant add new website from dashboard",()=>{
        let option = 'dashboard';
        website.addWebsite(option);
    });

    xit("signup new Merchant",()=>{
        var data = {
            on : 'merchant',
        };
        utility.SignUp(data, (signupData) => {

            loginData = signupData;
        });
    });

    xit("New merchant add new website from dashboard",()=>{
        let option = 'new';
        website.addWebsite(option,loginData);
    });

    xit("edit website from dashboard",()=>{
        let option = 'dashboard';
        website.editWebsite(option);
    });

    xit("edit website from details",()=>{
        let option = 'details';
        website.editWebsite(option);
    });
    
    xit("Get website Details from sidemenu",()=>{
        var option = 'sidemenu';
        website.websiteDetails(option);
    });

    it("Get website Details from dashboard",()=>{
        var option = 'dashboard';
        website.websiteDetails(option);
    });
    
    xit("Existing merchant list websites with filter Sales",()=>{
        let option ={
            merchState : 'exist',
            filter : 'sales'
        };
        website.listWebsites(option);
    });

    xit("Existing merchant list websites with filter Clicks",()=>{
        let option ={
            merchState : 'exist',
            filter : 'clicks'
        };
        website.listWebsites(option);
    });

    xit("Existing merchant list websites with filter Views",()=>{
        let option ={
            merchState : 'exist',
            filter : 'views'
        };
        website.listWebsites(option);
    });

    xit("Existing merchant list websites with filter Gross Profit",()=>{
        let option ={
            merchState : 'exist',
            filter : 'gross'
        };
        website.listWebsites(option);
    });


});