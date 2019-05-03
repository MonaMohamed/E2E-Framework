// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const { SpecReporter } = require('jasmine-spec-reporter');
const  HtmlReporter  = require('protractor-beautiful-reporter');
var fs = require('fs');

var deleteFolderRecursive = function(path){
  if(fs.existsSync(path)){
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()){
        deleteFolderRecursive(curPath);
      }else{
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

exports.config = {
  allScriptsTimeout: 360000,
  specs: [
    './test/scenarios/**/*.spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    chromeOptions: {
      args: [
        '--window-size=1025,800',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ]
    }
  },
  //SELENIUM_PROMISE_MANAGER : false,
  //directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 360000,
    print: function() {}
  },
  suites:{
    all: './test/scenarios/**/*.spec.ts',
    login : './test/scenarios/Login/*.spec.ts',
    application: './test/scenarios/Application/*.spec.ts',
    store:'./test/scenarios/Store/*.spec.ts',
    website:'./test/scenarios/website/*.spec.ts',
    signup : './test/scenarios/signUp/*.spec.ts'
  },
  getPageTimeout : 3000,
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    deleteFolderRecursive('results');
    jasmine.getEnv().addReporter(new HtmlReporter({ 
      baseDirectory: 'results'
    }).getJasmine2Reporter()); 
    //browser.waitForAngularEnabled(false); 
  },
  params: {
    env: {
      name: 'local'
    }
  }
};