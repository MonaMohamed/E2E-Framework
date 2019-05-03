import {ApplicationUtility} from '../../merchant/application/Application';
import {Utility} from './../../common/utility';
import { browser } from 'protractor';
const utility = new Utility();
const app     = new ApplicationUtility();
let loginData : any;


describe('Merchant Applications', ()=> {
    
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
    
    it("existing merchant add new app from sidemenu",()=>{
        let option = 'sidemenu';
        app.addApp(option);
    });

    it("existing merchant add new app from dashboard",()=>{
        let option = 'dashboard';
        app.addApp(option);
    });

    xit("signup new Merchant",()=>{
        var data = {
            on : 'merchant',
        };
        utility.SignUp(data, (signupData) => {

            loginData = signupData;
        });
    });

    xit("New merchant add new app from dashboard",()=>{
        let option = 'new';
        app.addApp(option,loginData);
    });

    it("edit application from dashboard",()=>{
        let option = 'dashboard';
        app.editApp(option);
    });

    it("edit application from details",()=>{
        let option = 'details';
        app.editApp(option);
    });
    
    it("Existing merchant list applictions with filter Sales",()=>{
        let option ={
            merchState : 'exist',
            filter : 'sales'
        };
        app.listApps(option);
    });

    it("Existing merchant list applictions with filter Requests",()=>{
        let option ={
            merchState : 'exist',
            filter : 'requests'
        };
        app.listApps(option);
    });

    it("Existing merchant list applictions with filter Gross Profit",()=>{
        let option ={
            merchState : 'exist',
            filter : 'gross'
        };
        app.listApps(option);
    });
    
    it("Get Application Details from sidemenu",()=>{
        var option = 'sidemenu';
        app.appDetail(option);
    });

    it("Get Application Details from dashboard",()=>{
        var option = 'dashboard';
        app.appDetail(option);
    });

    it("Filter accepted app transactions ",()=>{
        var type = 'app';
        var option = {
            status : '0',
            user : 'All'
        }
        app.transactionDetails(type,option);

    });

    it("Filter rejected app transactions ",()=>{
        var type = 'app';

        var option = {
            status : '2'
        }
        app.transactionDetails(type,option);
    });

    it("Filter pending app transactions ",()=>{
        var type = 'app';

        var option = {
            status  : '1'
        }
        app.transactionDetails(type,option);
    });

    it("Filter cancelled app transactions ",()=>{
        var type = 'app';

        var option = {
            status : '3'
        }
        app.transactionDetails(type,option);
    });

    it("Get app log from dashboard",()=>{
         var option =  'dashboard';
         app.appLog(option);
    });

    it("Get app log from details",()=>{
        var option = 'details';
        app.appLog(option);
    });

    it("Change App State ",()=>{
        app.changeStateFromEdit();
    });
});