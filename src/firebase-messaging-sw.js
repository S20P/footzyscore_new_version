importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

var config = {
    apiKey: 'AIzaSyAeswPszZdevD86Vy9G4lROL3GUxRnRpZY',
    authDomain: 'football-worldcup-2018-d85c3.firebaseapp.com',
    databaseURL: "https://football-worldcup-2018-d85c3.firebaseio.com",
    projectId: 'football-worldcup-2018-d85c3',
    storageBucket: 'football-worldcup-2018-d85c3.appspot.com',
    messagingSenderId: '585983855098'
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    const title = 'footzylive';
    const options = {
        body: payload.data.status
    };
    return self.registration.showNotification(title, options);
});