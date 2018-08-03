import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewChecked,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { MatchService } from '../service/match.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { DatePipe } from '@angular/common';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import * as moment from 'moment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public match_ground_details = [];
  public currentdaydate: any;
  public localtimezone: any;
  public comp_id: any;

  // public flage_baseUrl: any;
  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    // this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
  }

  ngOnInit() {

    this.match_ground_details = [];
    var dateofday = Date();

    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

    //console.log("today side bar", currentdaydate);
    this.GetMatchesByDate(currentdaydate);
    this.currentdaydate = currentdaydate;
  }




  GetMatchesByCompetition_ById_live() {

    let current_matchId;
    this.liveMatchesApiService.liveMatches().subscribe(record => {
      // console.log("Live-Matches-data", data);
      var result = record['data'];
      console.log("live data", result['events']);
      var result_events = result.events;
      if (result_events !== undefined) {

        current_matchId = result_events['id'];
        var item = result_events;
        for (let j = 0; j < this.match_ground_details['length']; j++) {
          console.log("**", this.match_ground_details[j]);
          var group = this.match_ground_details[j].group;

          for (let i = 0; i < group['length']; i++) {
            if (group[i].id == current_matchId) {


              //time---------------------------------------------------------------------
              var time: any = item['time'];
              var starting_at: any = time.starting_at;
              var date_time: any = starting_at.date_time; //YYYY-MM-DD H:MM:SS
              let match_time: any = this.jsCustomeFun.ChangeTimeZone(date_time);
              var status: any = time.status;
              var time_formatte = moment(new Date(match_time)).format('hh:mm a');
              var live_status: boolean = false;
              if (status == "LIVE" || status == "PEN_LIVE" || status == "HT" || status == "BREAK") {
                live_status = true;
                status = status;
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

              var localteam_score: any = scores.localteam_score;
              var visitorteam_score: any = scores.visitorteam_score;
              var score_status_flage: boolean = true;
              if (localteam_score == '?' || localteam_score == "" || localteam_score == null || visitorteam_score == '?' || visitorteam_score == "" || visitorteam_score == null) {
                live_status = false;
                score_status_flage = false;
              }
              if (localteam_score >= '0' || visitorteam_score >= '0') {
                score_status_flage = true;
                if (status == time_formatte) {
                  score_status_flage = false;
                }
              }

              var penalty_visitor: any = scores.visitorteam_pen_score;
              var penalty_local: any = scores.localteam_pen_score;

              //Which team is high scores------------------------------------------
              //*apply class for text-bold=>font-wight:bold if team run is highest

              var ltScore_highest: boolean = false;
              var vtScore_highest: boolean = false;

              if (localteam_score == 0) {
                ltScore_highest = false;
              }
              if (visitorteam_score == 0) {
                vtScore_highest = false;
              }
              if (localteam_score >= visitorteam_score) {
                ltScore_highest = true;
              }
              if (visitorteam_score >= localteam_score) {
                vtScore_highest = true;
              }

              //end scores------------------------------------------



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
              console.log("live data");
              console.log("group[i].id", group[i].id);
              console.log("item", item);
              console.log("start======================================================");
              console.log("current_matchId", current_matchId);
              console.log("status", status);
              console.log("live_status", live_status);
              console.log("localteam_score", localteam_score);
              console.log("visitorteam_score", visitorteam_score);
              console.log("score_status_flage", score_status_flage);
              console.log("ltScore_highest", ltScore_highest);
              console.log("vtScore_highest", vtScore_highest);
              console.log("penalty_local", penalty_local);
              console.log("penalty_visitor", penalty_visitor);
              console.log("start Date ", date_time);

              console.log("end======================================================");

              group[i]['id'] = item.id;
              group[i]['status'] = status;
              group[i]['live_status'] = live_status;
              group[i]['localteam_score'] = localteam_score;
              group[i]['visitorteam_score'] = visitorteam_score;
              group[i]['score_status_flage'] = score_status_flage;
              group[i]['ltScore_highest'] = ltScore_highest;
              group[i]['vtScore_highest'] = vtScore_highest;
              //.pen
              group[i]['penalty_local'] = penalty_local;
              group[i]['penalty_visitor'] = penalty_visitor;
              group[i]['penalty_localvist'] = penalty_localvist;

            }
          }
        }
      }
    });

    console.log("match_ground_details", this.match_ground_details);

  }



  GetMatchesByDate(selected) {
    this.match_ground_details = [];
    for (let i = 0; i < this.match_ground_details['length']; i++) {
      this.match_ground_details.splice(i, 1);
    }

    var param = {
      "date": selected,
      "localtimezone": this.localtimezone
    }

    this.matchService.GetAllCompetitionMatchesByDate(param).subscribe(record => {
      //console.log("record by selected Date", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {

          //console.log("todays matches item", item);

          var id: any = item['id'];
          var comp_id = item['league_id'];
          self.comp_id = item['league_id'];

          var stage: any = item['stage'];
          //console.log("stage", stage);
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
          let match_time: any = self.jsCustomeFun.ChangeTimeZone(date_time);
          var status: any = time.status;
          var time_formatte = moment(new Date(match_time)).format('hh:mm a');

          // var live_status: any = this.jsCustomeFun.CompareTimeDate(match_time);

          var live_status: boolean = false;

          if (status == "LIVE" || status == "PEN_LIVE" || status == "HT" || status == "BREAK") {
            live_status = true;
            status = status;
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

          if (localteam_score == '?' || localteam_score == "" || localteam_score == null || visitorteam_score == '?' || visitorteam_score == "" || visitorteam_score == null) {
            live_status = false;
            score_status_flage = false;
          }
          if (localteam_score >= '0' || visitorteam_score >= '0') {
            score_status_flage = true;
            if (status == time_formatte) {
              score_status_flage = false;
            }
          }

          var penalty_visitor: any = scores.visitorteam_pen_score;
          var penalty_local: any = scores.localteam_pen_score;

          //Which team is high scores------------------------------------------
          //*apply class for text-bold=>font-wight:bold if team run is highest

          var ltScore_highest: boolean = false;
          var vtScore_highest: boolean = false;

          if (localteam_score == 0) {
            ltScore_highest = false;
          }
          else if (visitorteam_score == 0) {
            vtScore_highest = false;
          }
          else if (localteam_score >= visitorteam_score) {
            ltScore_highest = true;
          } else if (visitorteam_score >= localteam_score) {
            vtScore_highest = true;
          }
          else {
            ltScore_highest = false;
            vtScore_highest = false;
          }



          //end scores------------------------------------------


          // AGG (0-0)--------------------------------------------
          var aggregate_id: any = item['aggregate_id'];
          var lats_score_local;
          var lats_score_vist;
          var agg_localvist: boolean = false;
          if (aggregate_id !== null) {

            var aggregate_data = item['aggregate'].data;
            //   //console.log("aggregate_data", aggregate_data);
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
            venue_data = item['venue'].data;
            venue_name = venue_data.name;
            venue_city = venue_data.city;
          }
          //end venue---------------------------------------------------------

          //season---------------------------------------------------------
          var season_id: any = item['season_id'];
          //end season---------------------------------------------------------


          var competitions = item.league['data'];
          if (!groups[competitions.id]) {
            groups[competitions.id] = [];
            grouped.push({ competitions: competitions, group: groups[competitions.id] });
          }

          groups[competitions.id].push({
            "id": id,
            "comp_id": comp_id,
            "et_score": et_score,
            "formatted_date": match_time,
            "ft_score": ft_score,
            "ht_score": ht_score,
            "localteam_id": localteam_id,
            "localteam_name": localteam_name,
            "localteam_score": localteam_score,
            "localteam_image": flag__loal,
            "penalty_local": penalty_local,
            "penalty_visitor": penalty_visitor,
            "penalty_localvist": penalty_localvist,
            "agg_localvist": agg_localvist,
            "status": status,
            "time": match_time,
            "visitorteam_id": visitorteam_id,
            "visitorteam_name": visitorteam_name,
            "visitorteam_score": visitorteam_score,
            "visitorteam_image": flag_visit,
            "competitions": competitions,
            "lats_score_local": lats_score_local,
            "lats_score_vist": lats_score_vist,
            "venue_id": venue_id,
            "venue": venue_name,
            "venue_city": venue_city,
            "week": week,
            "live_status": live_status,
            "score_status_flage": score_status_flage,
            "ltScore_highest": ltScore_highest,
            "vtScore_highest": vtScore_highest
          });
        });
        //console.log("grouped", grouped);
        this.match_ground_details = grouped;
      }
    })

    //console.log("filter-date_data", this.match_ground_details);

  }

  CompetitionDetails(comp_id) {
    //console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

  matchdetails_go(id) {
    this.router.navigate(['/matches', id]);
  }
}
