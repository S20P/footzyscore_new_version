import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
declare var jQuery: any;
import * as moment from 'moment-timezone';
import "moment-timezone";

import { HttpClient } from '@angular/common/http';

@Injectable()
export class JsCustomeFunScriptService {

  date;

  constructor(private http: HttpClient) {
    this.date = new Date();
  }


  ChangeTimeZone(dateto) {
    // let d = new Date(dateto);
    // let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // let nd = new Date(utc + (3600000 * offset));
    // return nd.toLocaleString();
    var utcTime = moment.utc(dateto).format('YYYY-MM-DD HH:mm');

    //get text from divUTC and conver to local timezone  
    var localTime = moment.utc(utcTime).toDate();
    var result = moment(localTime).format('YYYY-MM-DD hh:mm:ss a')

    return result;


  }

 

  CompareTimeDate(DateTime_Value) {
    var date1 = new Date(DateTime_Value);

    var date2 = new Date();

    var status = false;
    if (date1 >= date2) {
      status = false;
    }
    else {
      status = true;
    }
    return status;
  }


  // YYYY-MM-DD
  ChangeDateFormat(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }



  SpliteStrDateFormat(strDate) {
    var arr = strDate.split('.');
    let day = arr[0];
    let month = arr[1];
    let year = arr[2];
    return year + "-" + month + "-" + day;
  }


  LocalTimeZone(){
   return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }


  firstDay_Month(){
    var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var firstDay_formate = moment(firstDay).format("YYYY-MM-DD");
    return firstDay_formate;
  }

  lastDay_Month(){
    var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    var lastDay_formate = moment(lastDay).format("YYYY-MM-DD");
   return lastDay_formate;
  }

  
  






}
