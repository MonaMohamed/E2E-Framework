import {Store} from '../../merchant/store/Store';
import {Utility} from './../../common/utility';
import { browser } from 'protractor';
import { async } from 'q';
const utility = new Utility();
const store     = new Store();
let loginData : any;

describe('Merchant Stores', ()=> {
    
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

    it("existing merchant add new store from sidemenu",()=>{
        let option = 'sidemenu';
        store.addStore(option);
    });

    it("existing merchant add new store from dashboard",()=>{
        let option = 'dashboard';
        store.addStore(option);
    });

    xit("signup new Merchant",()=>{
        var data = {
            on : 'merchant',
        };
        utility.SignUp(data, (signupData) => {

            loginData = signupData;
        });
    });

    xit("New merchant add new store from dashboard",()=>{
        let option = 'new';
        store.addStore(option,loginData);
    });

    it("edit store from dashboard",()=>{
        let option = 'dashboard';
        store.editStore(option);
    });

    it("edit store from details",()=>{
        let option = 'details';
        store.editStore(option);
    });

    it("Existing merchant list stores with filter Accepted",()=>{
        let option ={
            merchState : 'exist',
            filter : '0'
        };
        store.listStores(option);
    });

    it("Existing merchant list stores with filter Pending",()=>{
        let option ={
            merchState : 'exist',
            filter : '1'
        };
        store.listStores(option);
    });

    it("Existing merchant list stores with filter rejected",()=>{
        let option ={
            merchState : 'exist',
            filter : '2'
        };
        store.listStores(option);
    });

    it("Existing merchant list stores with filter canceled",()=>{
        let option ={
            merchState : 'exist',
            filter : '3'
        };
        store.listStores(option);
    });

    it("Get store Details from sidemenu",()=>{
        var option = 'sidemenu';
        store.storeDetail(option);
    });

    it("Get store Details from dashboard",()=>{
        var option = 'dashboard';
        store.storeDetail(option);
    });

    it("Filter accepted store transactions ",()=>{
        var option = {
            status : '0',
            user : 'All'
        }
        store.transactionDetails(option);

    });

    it("Filter rejected store transactions ",()=>{
        var option = {
            status : '2'
        }
        store.transactionDetails(option);
    });

    it("Filter pending store transactions ",()=>{
        var option = {
            status  : '1'
        }
        store.transactionDetails(option);
    });

    it("Filter cancelled store transactions ",()=>{
        var option = {
            status : '3'
        }
        store.transactionDetails(option);
    });
});