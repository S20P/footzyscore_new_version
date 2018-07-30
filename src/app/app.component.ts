import {
    Component,
    OnInit,
    EventEmitter,
    Output
} from '@angular/core';

import { PushNotificationService } from './service/push-notification/push-notification.service';
import { MessagingService } from './service/firebase/messaging.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute, Router, ParamMap, RoutesRecognized } from '@angular/router';
import * as firebase from "firebase";

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

// declare var firebase: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})


export class AppComponent {

    loading;
    albums;
    items;
    message;
    user;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _notificationService: PushNotificationService,
        private msgService: MessagingService
    ) {
        localStorage.removeItem('firebase:previous_websocket_failure');
        this.loading = "none";
        this._notificationService.requestPermission();
   
   }

    ngOnInit() {

        this.msgService.getPermission();


        this.msgService.currentMessage.subscribe(data => {
            console.log("message-resis", data);
            if (data !== null) {
                this.message = data['data'];
                console.log("message is...*", this.message);
                console.log("body", this.message.body);
                let datamsg: Array<any> = [];
                datamsg.push({
                    'title': this.message.title,
                    'alertContent': this.message.body,
                    'click_action': this.message.click_action,
                    'action_id': this.message.action_id
                });
                this._notificationService.generateNotification(datamsg);
            }

        });


        let data = this.msgService.Subscribe_topic();
        console.log("mess-dd", data);




    }










}
