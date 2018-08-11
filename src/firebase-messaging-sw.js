// importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-database.js');
importScripts("https://www.gstatic.com/firebasejs/5.3.1/firebase.js");


// var config = {
//     apiKey: 'AIzaSyAeswPszZdevD86Vy9G4lROL3GUxRnRpZY',
//     authDomain: 'football-worldcup-2018-d85c3.firebaseapp.com',
//     databaseURL: "https://football-worldcup-2018-d85c3.firebaseio.com",
//     projectId: 'football-worldcup-2018-d85c3',
//     storageBucket: 'football-worldcup-2018-d85c3.appspot.com',
//     messagingSenderId: '585983855098'
// };



// Initialize Firebase //mytest project credensal
var config = {
    apiKey: "AIzaSyAyzGsdCrxMZoWngMNDLZRH1Bj9gMto-Fg",
    authDomain: "fifaapps-cfb25.firebaseapp.com",
    databaseURL: "https://fifaapps-cfb25.firebaseio.com",
    projectId: "fifaapps-cfb25",
    storageBucket: "fifaapps-cfb25.appspot.com",
    messagingSenderId: "1098681878297"
};



firebase.initializeApp(config);

const messaging = firebase.messaging();

console.log("Firebase messaging", messaging);

messaging.setBackgroundMessageHandler(function(payload) {
    const title = 'footzyScore';
    const options = {
        body: payload.data.status
    };
    return self.registration.showNotification(title, options);
});