// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAeswPszZdevD86Vy9G4lROL3GUxRnRpZY',
    authDomain: 'football-worldcup-2018-d85c3.firebaseapp.com',
    databaseURL: "https://football-worldcup-2018-d85c3.firebaseio.com",
    projectId: 'football-worldcup-2018-d85c3',
    storageBucket: 'football-worldcup-2018-d85c3.appspot.com',
    messagingSenderId: '585983855098'
  }
};

// firebase: {
//   apiKey: 'AIzaSyAeswPszZdevD86Vy9G4lROL3GUxRnRpZY',
//   authDomain: 'football-worldcup-2018-d85c3.firebaseapp.com',
//   databaseURL:"https://football-worldcup-2018-d85c3.firebaseio.com",
//   projectId: 'football-worldcup-2018-d85c3',
//   storageBucket: 'football-worldcup-2018-d85c3.appspot.com',
//   messagingSenderId: '585983855098'
// }


// <script src="https://www.gstatic.com/firebasejs/5.1.0/firebase.js"></script>
// <script>
//   // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyAyzGsdCrxMZoWngMNDLZRH1Bj9gMto-Fg",
//     authDomain: "fifaapps-cfb25.firebaseapp.com",
//     databaseURL: "https://fifaapps-cfb25.firebaseio.com",
//     projectId: "fifaapps-cfb25",
//     storageBucket: "",
//     messagingSenderId: "1098681878297"
//   };
//   firebase.initializeApp(config);
// </script>

