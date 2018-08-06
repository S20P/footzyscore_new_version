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


  LocalTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }


  firstDay_Month() {
    var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var firstDay_formate = moment(firstDay).format("YYYY-MM-DD");
    return firstDay_formate;
  }

  lastDay_Month() {
    var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    var lastDay_formate = moment(lastDay).format("YYYY-MM-DD");
    return lastDay_formate;
  }


  HandleDataofAPI(item) {
    console.log("dynamic handle data in jsfile", item);

    var id: any = item['id'];
    var comp_id = item['league_id'];
    var stage: any = item['stage'];
    var stage_data = stage['data'];
    if (stage_data !== undefined || stage_data['length'] !== 0 || stage_data !== null) {
      var week: any = stage_data.name;
    }
    //LocalTeam Data---------------------------------------------------------
    var localteam_id: any = item['localteam_id'];
    var localTeam_details: any = item['localTeam'].data;
    var localteam_name: any = localTeam_details.name;
    var flag__loal: any = localTeam_details.logo_path;

    //visitorTeam Data--------------------------------------------------------
    var visitorteam_id: any = item['visitorteam_id'];
    var visitorTeam_details: any = item['visitorTeam'].data;
    var visitorteam_name: any = visitorTeam_details.name;
    var flag_visit: any = visitorTeam_details.logo_path;


    //time---------------------------------------------------------------------
    var time: any = item['time'];
    var starting_at: any = time.starting_at;
    var date_time: any = starting_at.date_time; //YYYY-MM-DD H:MM:SS
    let match_time: any = this.ChangeTimeZone(date_time);
    var status: any = time.status;
    var time_formatte = moment(new Date(match_time)).format('hh:mm a');
    let live_minuts: any = time.minute;
    var live_status: boolean = false;

    if (status == "LIVE" || status == "PEN_LIVE" || status == "ET") {
      live_status = true;
      status = live_minuts;
    }
    else if (status == "HT" || status == "BREAK") {
      live_status = true;
      status = status;
      console.log("App status is live", live_status);
    }
    else if (status == "FT" || status == "AET" || status == "POSTP" || status == "FT_PEN") {
      live_status = false;
      status = status;
    }
    else if (status == "NS" || status == "") {
      live_status = false;
      status = time_formatte;
    }
    else {
      live_status = false;
      status = status;
    }

    //end time---------------------------------------------------------------------

    //scores----------------------------------------------------------------------
    var scores: any = item['scores'];
    var ht_score: any = scores.ht_score;
    var ft_score: any = scores.ft_score;
    var et_score: any = scores.et_score;
    var localteam_score: any = scores.localteam_score;
    var visitorteam_score: any = scores.visitorteam_score;
    var score_status_flage: boolean = true;
    if (localteam_score == '?' || localteam_score == "" || visitorteam_score == '?' || visitorteam_score == "") {
      score_status_flage = false;
    }
    if (localteam_score >= 0 || visitorteam_score >= 0) {
      score_status_flage = true;
      if (status == time_formatte) {
        score_status_flage = false;
      }
    }
    if (localteam_score == null || visitorteam_score == null) {
      localteam_score = 0;
      visitorteam_score = 0;
      score_status_flage = true;
    }

    var penalty_visitor: any = scores.visitorteam_pen_score;
    var penalty_local: any = scores.localteam_pen_score;

    //Which team is high scores------------------------------------------
    //*apply class for text-bold=>font-wight:bold if team run is highest

    var ltScore_highest: boolean = false;
    var vtScore_highest: boolean = false;

    //check score is high/low
    if (localteam_score <= 0) {
      ltScore_highest = false;
    }
    if (visitorteam_score <= 0) {
      vtScore_highest = false;
    }
    if (localteam_score > 0) {
      if (localteam_score >= visitorteam_score) {
        ltScore_highest = true;
      }
    }
    if (visitorteam_score > 0) {
      if (visitorteam_score >= localteam_score) {
        vtScore_highest = true;
      }
    }
    //end scores------------------------------------------


    // AGG (0-0)--------------------------------------------
    var aggregate_id: any = item['aggregate_id'];
    var lats_score_local;
    var lats_score_vist;
    var agg_localvist: boolean = false;
    if (aggregate_id !== null) {

      var aggregate_data = item['aggregate'].data;
      //   console.log("aggregate_data", aggregate_data);
      var agg_result = aggregate_data.result;

      if (agg_result !== "" || agg_result == null) {
        var vscore;
        var lscore;
        agg_localvist = true;
        if (localteam_score == "" || localteam_score == null || localteam_score == undefined || visitorteam_score == "" || visitorteam_score == null || visitorteam_score == undefined) {
          vscore = 0;
          lscore = 0;
        }
        else {
          vscore = visitorteam_score;
          lscore = localteam_score;
        }
        let string1 = agg_result.split("-", 2);
        lats_score_local = parseInt(string1[1]) + parseInt(lscore);
        lats_score_vist = parseInt(string1[0]) + parseInt(vscore);
      } else {
        agg_localvist = false;
      }

    }
    // end AGG (0-0)-------------------------------------------
    //PEN (0-0)------------------------------------------------
    var penalty_localvist: boolean = false;
    if (penalty_local == '0' && penalty_visitor == '0') {
      penalty_localvist = false;
    }
    else if (penalty_local !== "" && penalty_local !== null && penalty_local !== undefined && penalty_visitor !== "" && penalty_visitor !== null && penalty_visitor !== undefined) {
      penalty_localvist = true;
    }
    else {
      penalty_localvist = false;

    }
    //end PEN (0-0)--------------------------------------------


    //venue---------------------------------------------------------
    var venue_id: any = item['venue_id'];
    var venue_data;
    var venue_name;
    var venue_city;
    if (venue_id !== null) {
      if (item['venue'] !== undefined) {
        venue_data = item['venue'].data;
        venue_name = venue_data.name;
        venue_city = venue_data.city;
      }
    }
    //end venue---------------------------------------------------------

    //season---------------------------------------------------------
    var season_id: any = item['season_id'];
    //end season---------------------------------------------------------


    var obj = {
      "id": id,
      "comp_id": comp_id,
      "week": week,
      "venue_id": venue_id,
      "venue": venue_name,
      "venue_city": venue_city,
      "localteam_id": localteam_id,
      "localteam_name": localteam_name,
      "localteam_score": localteam_score,
      "flag__loal": flag__loal,
      "visitorteam_id": visitorteam_id,
      "visitorteam_name": visitorteam_name,
      "visitorteam_score": visitorteam_score,
      "flag_visit": flag_visit,
      "match_time": match_time,
      "status": status,
      "ft_score": ft_score,
      "ht_score": ht_score,
      "et_score": et_score,
      "lats_score_local": lats_score_local,
      "lats_score_vist": lats_score_vist,
      "penalty_local": penalty_local,
      "penalty_visitor": penalty_visitor,
      "penalty_localvist": penalty_localvist,
      "agg_localvist": agg_localvist,
      "score_status_flage": score_status_flage,
      "ltScore_highest": ltScore_highest,
      "vtScore_highest": vtScore_highest,
      "live_status": live_status,
    }
    return obj;
  }








}
