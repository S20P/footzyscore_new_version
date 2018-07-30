import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//  import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
declare var $: any;
// import firebase from 'firebase/app';
 import * as firebase from 'firebase/app';

//import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/firestore';
import 'firebase/messaging';


import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { CommentStmt } from '@angular/compiler';

@Injectable()
export class MessagingService {
  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)
  token;

  message;
  headers = new HttpHeaders();
  api: string = "https://iid.googleapis.com/iid/v1/";
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private http: HttpClient) {
    this.receiveMessage();
  }


  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;

      const data = { [user.uid]: token }
      this.db.object('fcmTokens/').update(data)
    })
  }

  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        this.token = token
        this.updateToken(token)

      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
       this.message = payload;
       this.currentMessage.next(payload)
    });
  }

 
  Subscribe_topic() {

    this.messaging.getToken().then(token => {
      console.log("toej", token);
      // let headers = this.headers.set("authorization", "key=AIzaSyAnYT98H8ny59MxNXQJq1R3KKcUWyZtdpY");
      // headers = this.headers.set("cache-control", "no-cache");
      // headers = this.headers.set("content-type", "application/x-www-form-urlencoded");
      // headers = this.headers.set("Content-Length", '0');


      // let apiurl = `${this.api + token + "/rel/topics/livescores"}`;
      // let apiurl = `${this.api + token + "/rel/topics/2323224"}`;

       let apiurl = `${this.api + token + "/rel/topics/2323223"}`;
      
      console.log("urlis", apiurl);
      // this.http.post(apiurl, { headers: headers }).subscribe(
      //   data => {
      //     console.log("data..", data);
      //   },
      //   err => console.log(err)
      // );
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": apiurl,
        "method": "POST",
        "headers": {
          "authorization": "key=AIzaSyAnYT98H8ny59MxNXQJq1R3KKcUWyZtdpY",
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
        }
      }

      $.ajax(settings).done(function (response) {
        console.log("response", response);
      });


    });


  }
}
