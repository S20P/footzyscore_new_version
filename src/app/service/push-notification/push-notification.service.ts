import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/Observable';



@Injectable()
export class PushNotificationService {
  public permission: Permission;
  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }
  public isSupported(): boolean {
    return 'Notification' in window;
  }
  requestPermission(): void {
    let self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return self.permission = status;
      });
    }
  }
  create(title: string, options?: PushNotification): any {
    let self = this;
    return new Observable(function (obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log("The user hasn't granted you permission to send push notifications");
        obs.complete();
      }
      let _notify = new Notification(title, options);
      _notify.onshow = function (e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = function (e) {

        console.log("onclick msg", e['currentTarget']);
        let notification = e['currentTarget'];

        console.log("notification", notification);
        let matche_id = notification['data'];


        //http://localhost:4200/matches/2323219;comp_id=1056

        let str_link = window.location.origin + "/matches/" + matche_id + ";comp_id=1056";
        console.log("str is", str_link);

        //this.router.navigate(['/matches', matche_id, { "comp_id": comp_id }]);

        window.open(str_link);

        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }
  generateNotification(source: Array<any>): void {
    let self = this;
    source.forEach((item) => {
      let options = {
        body: item.alertContent,
        icon: "/assets/img/ic_goal.png",
        data: item.action_id,
      };
      let title = "footzylive";
      let notify = self.create(title, options).subscribe();
    })
  }














}
export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}








