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
    var utcTime = moment.utc(dateto, 'YYYY-MM-DD HH:mm:ss a').format('YYYY-MM-DD HH:mm');
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
    //console.log("dynamic handle data in jsfile", item);

    var id: any = item['id'];
    var comp_id = item['league_id'];
    var stage: any = item['stage'];
    var week: any = "";
    var round_id: any = item['round_id'];
    var round: any = item['round'];
    if (round_id) {
      if (round_id !== undefined || round_id !== "" || round_id !== null) {
        if (round) {
          var round_data = round['data'];
          if (round_data !== undefined || round_data['length'] !== 0 || round_data !== null) {
            week = round_data.name;
            var checkstr = $.isNumeric(week);

            if (checkstr == true) {
              week = "Week " + week;
            } else {
              week = week;
            }
            if (week == "") {
              week = "Week all";
            } else {
              week = week;
            }
          }
        }
      }
    } else {
      if (stage) {
        var stage_data = stage['data'];
        if (stage_data !== undefined || stage_data['length'] !== 0 || stage_data !== null) {
          week = stage_data.name;
        }
      }
    }

    var localteam_id: any = "";
    var visitorteam_id: any = "";
    var localteam_name: any = "";
    var flag__loal: any = "";
    var visitorteam_name: any = "";
    var flag_visit: any = "";

    localteam_id = item['localteam_id'];
    visitorteam_id = item['visitorteam_id'];
    //LocalTeam Data---------------------------------------------------------
    if (item['localTeam']) {
      var localTeam_details: any = item['localTeam'].data;
      if (localTeam_details !== undefined || localTeam_details['length'] !== 0 || localTeam_details !== null) {
        localteam_name = localTeam_details.name;
        flag__loal = localTeam_details.logo_path;
      }
    }
    //visitorTeam Data--------------------------------------------------------
    if (item['visitorTeam']) {
      var visitorTeam_details: any = item['visitorTeam'].data;
      if (visitorTeam_details !== undefined || visitorTeam_details['length'] !== 0 || visitorTeam_details !== null) {
        visitorteam_name = visitorTeam_details.name;
        flag_visit = visitorTeam_details.logo_path;
      }
    }


    //time---------------------------------------------------------------------
    var time: any = item['time'];
    var starting_at: any = "";
    var date_time: any = "";
    let match_time: any = "";
    var status: any = "";
    var time_formatte = "";
    let live_minuts: any = "";
    var live_status: boolean = false;
    var date: any = "";
    if (time) {
      starting_at = time.starting_at;
      date_time = starting_at.date_time; //YYYY-MM-DD H:MM:SS
      date = starting_at.date;
      match_time = this.ChangeTimeZone(date_time);
      // console.log("match_time", match_time);
      status = time.status;
      time_formatte = moment(match_time, 'YYYY-MM-DD HH:mm:ss a').format('hh:mm a');
      // console.log("time_formatte", time_formatte);
      // var time_formatte1 = moment(match_time, 'YYYY-MM-DD HH:mm:ss a').format('DD MMM YYYY');  //ex 09 Aug 2018
      // console.log("time_formatte1", time_formatte1);

      live_minuts = time.minute;
      if (live_minuts == null) {
        live_minuts = "0";
      }
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
      else if (status == "NS" || status == "TBA" || status == "") {
        live_status = false;
        status = time_formatte;
      }
      else {
        live_status = false;
        status = status;
      }
    }
    //end time---------------------------------------------------------------------

    //scores----------------------------------------------------------------------
    var scores: any = item['scores'];
    var ht_score: any = "";
    var ft_score: any = "";
    var et_score: any = "";
    var localteam_score: any = "";
    var visitorteam_score: any = "";
    var score_status_flage: boolean = true;
    var penalty_visitor: any = "";
    var penalty_local: any = "";
    var ltScore_highest: boolean = false;
    var vtScore_highest: boolean = false;
    if (scores) {
      ht_score = scores.ht_score;
      ft_score = scores.ft_score;
      et_score = scores.et_score;
      localteam_score = scores.localteam_score;
      visitorteam_score = scores.visitorteam_score;

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

      penalty_visitor = scores.visitorteam_pen_score;
      penalty_local = scores.localteam_pen_score;

      //Which team is high scores------------------------------------------
      //*apply class for text-bold=>font-wight:bold if team run is highest

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
    }
    //end scores------------------------------------------


    // AGG (0-0)--------------------------------------------
    var aggregate_id: any = item['aggregate_id'];
    var lats_score_local: any;
    var lats_score_vist: any;
    var agg_localvist: boolean = false;
    if (aggregate_id !== null) {
      if (item['aggregate']) {
        var aggregate_data = item['aggregate'].data;
        var agg_result = aggregate_data.result;
        if (agg_result !== "" || agg_result == null) {
          agg_localvist = true;
          let string1 = agg_result.split("-", 2);
          var agg_locaTeamId = aggregate_data['localteam_id'];
          if (agg_locaTeamId == localteam_id) {
            lats_score_local = parseInt(string1[0]);
            lats_score_vist = parseInt(string1[1]);
          } else {
            lats_score_local = parseInt(string1[1]);
            lats_score_vist = parseInt(string1[0]);
          }
        } else {
          agg_localvist = false;
        }
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
    var venue_name: any;
    var venue_city: any;
    if (venue_id !== null) {
      if (item['venue']) {
        venue_data = item['venue'].data;
        if (venue_data !== undefined || venue_data !== "" || venue_data !== null) {
          venue_name = venue_data.name;
          venue_city = venue_data.city;
        }
      }
    }
    //end venue---------------------------------------------------------

    //season---------------------------------------------------------
    var season_id: any = item['season_id'];
    var season_data;
    var season_name;
    if (season_id !== null) {
      if (item['season']) {
        season_data = item['season'].data;
        if (season_data !== undefined || season_data !== "" || season_data !== null) {
          season_name = season_data.name;
        }
      }
    }
    //end season---------------------------------------------------------
    var competitions: any = "";
    if (item['league']) {
      var competitions_data = item.league['data'];
      if (competitions_data !== undefined || competitions_data !== "" || competitions_data !== null) {
        competitions = {
          "id": comp_id,
          "name": competitions_data.name
        };
      }
    }
    var collection = {
      "id": id,
      "league_id": comp_id,
      "week": week,
      "venue_id": venue_id,
      "venue": venue_name,
      "venue_city": venue_city,
      "season_id": season_id,
      "season_name": season_name,
      "localteam_id": localteam_id,
      "localteam_name": localteam_name,
      "localteam_score": localteam_score,
      "localteam_image": flag__loal,
      "penalty_local": penalty_local,
      "lats_score_local": lats_score_local,
      "ltScore_highest": ltScore_highest,
      "visitorteam_id": visitorteam_id,
      "visitorteam_name": visitorteam_name,
      "visitorteam_score": visitorteam_score,
      "visitorteam_image": flag_visit,
      "lats_score_vist": lats_score_vist,
      "penalty_visitor": penalty_visitor,
      "vtScore_highest": vtScore_highest,
      "match_time": moment(match_time, 'YYYY-MM-DD HH:mm:ss a'),
      "status": status,
      "competitions": competitions,
      "ft_score": ft_score,
      "ht_score": ht_score,
      "et_score": et_score,
      "penalty_localvist": penalty_localvist,
      "agg_localvist": agg_localvist,
      "score_status_flage": score_status_flage,
      "live_status": live_status,
      "date": date
    }
    return collection;
  }


  ordereLeaguebylist(grouped) {
    console.log("sort league list function call", grouped);
    var orderedKeys = [2, 8, 564, 384, 82, 570, 5, 1371, 1007, 12, 24, 9, 301, 72, 181, 208, 271, 390, 444, 462, 486, 501, 573, 609, 1128]; //Array of preordered keys
    var sortedArrayOfMaps = [];
    orderedKeys.map(function (key) {
      for (let row of grouped) {
        console.log("row", row);
        if (key == row['competitions'].id) {
          console.log("key", key);
          console.log("comp_id-key is", row['competitions'].id);
          sortedArrayOfMaps.push({ competitions: row.competitions, group: row.group });
        }
      }
    });
    return sortedArrayOfMaps;
  }

  //this function used for top Team & player list
  orderEventsbylist(grouped) {
    var orderedKeys = ["Goal", "Yellowcard", "Redcard", "Yellowred", "Penalty missed", "Substitution", "Own goal"]; //Array of preordered keys
    var sortedArrayOfMaps = [];
    orderedKeys.map(function (key) {
      for (let row of grouped) {
        if (key == row.type) {
          console.log("key", key);
          console.log("match-key is", row.type);
          sortedArrayOfMaps.push({ type: key, group: row.group });
        }
      }
    });
    return sortedArrayOfMaps;
  }


  range(start, end) {
    var myArray = [];
    for (var i = start; i <= end; i += 1) {
      myArray.push(i);
    }
    return myArray;
  }




}
