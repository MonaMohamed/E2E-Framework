
var data = {
    userName : 'merchop',
    mobileNumber : '7987467948',
    country:'egypt',
    code : '555555',
    password:'123456',
    newPassword:'123456',
    pin:'0000',
    newpin:'0000'
};
var loginData = {
    userName : 'merchop',
    password:'123456',
    pin:'0000'

};
var newMerch = {
    userName : 'lolo',
    password :'123456',
    pin : '0000'
}
var imagePath = {
    path1:'../images/image1.png',
    path2:'../images/image2.jpeg'
}
var date = {
    fromDate: {
        day : '1',
        month : 'March',
        year:'2018'
    },
    toDate :{
        day : '12',
        month : 'January',
        year:'2019'
    }
    
}

searchData = {
    user : 'merchuser',
    keyWord : 'mona01'
}

appLogFilter = {
    keyWord : 'makePayment',
    api : '/addCard',
    status : '200',
    transactionId : '4ca50100-c8b0-4799-9565-1443d09676cb',
    userId : 'b9b291f8-2acc-47cf-92ca-f9b0cec0a8ec',
    cardId : 'af664343-6fbe-45f6-98a5-b4f1fb90ae33'
}

storeData = {
    location1 : 'Cairo Festival City, Nasr City, Egypt',
    location2 : 'Alexandria City Hall, King Street, Alexandria, VA, USA'
}

module.exports = {
    data : data,
    loginData : loginData,
    newMerch : newMerch,
    imagePath : imagePath,
    date : date,
    searchData : searchData,
    appLogFilter : appLogFilter,
    storeData:storeData
}