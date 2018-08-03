
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { OrderPipe } from 'ngx-order-pipe';

import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import { MatchesApiService } from '../service/live_match/matches-api.service';

@Component({
  selector: 'app-competition-matches',
  templateUrl: './competition-matches.component.html',
  styleUrls: ['./competition-matches.component.css']
})
export class CompetitionMatchesComponent implements OnInit {

  match_ground_details = [];

  public list_matches = [];
  public selectedposition: any;

  @Input()
  set SelectedSeason(message: number) {
    this.filterData(message);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService,
    private liveMatchesApiService: MatchesApiService,

  ) {

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

  }

  ngOnInit() {
  }

  filterData(season_id) {
    this.GetAllMatchesBySeasonId(season_id);
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
  GetAllMatchesBySeasonId(season_id) {
    console.log("sesion_id for mathes", season_id);
    var season_id = season_id;
    var list = [];
    this.match_ground_details = [];
    this.list_matches = [];

    this.matchService.GetAllMatchesBySeasonId(season_id).subscribe(record => {
      console.log("GetAllMatchesByWeek", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {

        var array = result.reduce((r, { week, formatted_date }, index, arr) => {

          var data = arr[index];
          var last = r[r.length - 1];

          var id: any = data['id'];
          var comp_id = data['league_id'];

          var stage: any = data['stage'];
          var stage_data = stage['data'];

          if (stage_data !== undefined || stage_data['length'] !== 0 || stage_data !== null) {
            var week: any = stage_data.name;
          }
          //LocalTeam Data---------------------------------------------------------
          var localteam_id: any = data['localteam_id'];
          var localTeam_details: any = data['localTeam'].data;
          var localteam_name: any = localTeam_details.name;
          var flag__loal: any = localTeam_details.logo_path;

          //visitorTeam Data--------------------------------------------------------
          var visitorteam_id: any = data['visitorteam_id'];
          var visitorTeam_details: any = data['visitorTeam'].data;
          var visitorteam_name: any = visitorTeam_details.name;
          var flag_visit: any = visitorTeam_details.logo_path;

          //time---------------------------------------------------------------------
          var time: any = data['time'];
          var starting_at: any = time.starting_at;
          var date_time: any = starting_at.date_time; //YYYY-MM-DD H:MM:SS
          var date: any = starting_at.date;
          // let match_time: any = self.jsCustomeFun.ChangeTimeZone(date_time);
          console.log("date_time", date_time);
          let match_time: any = this.jsCustomeFun.ChangeTimeZone(date_time);
          console.log("match_time", match_time);

          var status: any = time.status;
          var time_formatte = moment(new Date(match_time)).format('hh:mm a');
          // var live_status: any = this.jsCustomeFun.CompareTimeDate(match_time);

          var live_status: boolean = false;
          var score_status_flage: boolean = true;

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
          var scores: any = data['scores'];
          var ht_score: any = scores.ht_score;
          var ft_score: any = scores.ft_score;
          var et_score: any = scores.et_score;
          var localteam_score: any = scores.localteam_score;
          var visitorteam_score: any = scores.visitorteam_score;

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
          var aggregate_id: any = data['aggregate_id'];
          var lats_score_local;
          var lats_score_vist;
          var agg_localvist: boolean = false;
          if (aggregate_id !== null) {

            var aggregate_data = data['aggregate'].data;
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
          var venue_id: any = data['venue_id'];
          var venue_data;
          var venue_name;
          var venue_city;
          if (venue_id !== null) {
            venue_data = data['venue'].data;
            venue_name = venue_data.name;
            venue_city = venue_data.city;
          }
          //end venue---------------------------------------------------------

          //season---------------------------------------------------------
          var season_id: any = data['season_id'];
          //end season---------------------------------------------------------

          var obj = {
            "id": id,
            "comp_id": comp_id,
            "et_score": et_score,
            "formatted_date": match_time,
            "date": date,
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

          };

          if (last && last.week.week === week) {
            last.group.push(obj);
          } else {
            r.push({ week: { week, match_time }, group: [obj] });
          }
          return r;
        }, []);
        //console.log(array);
        for (let p = 0; p < array['length']; p++) {
          console.log("item_week", array[p].week);
          var timezone = array[p].week.match_time;
          var trans_date = timezone;
          console.log("trans_date", trans_date);

          var date1 = new Date(trans_date);
          var date2 = new Date();

          console.log("date1", date1);
          console.log("date2", date2);

          var d1 = date1.getTime();
          var d2 = date2.getTime();

          if (d1 > d2) {
            console.log("date-comapre is d1", d1);
            console.log("date-comapre is d2", d2);

            var pos = p - 1;
            self.selectedposition = pos;
            console.log("pos", pos);

          }
          else {
            self.selectedposition = 0;
          }
        }

        this.match_ground_details = array.reverse();

      }
    });

    console.log("All Tops Matches by week are", this.match_ground_details);
    console.log("list dropdown", this.list_matches);
  }




  teamdetails(team_id) {
    this.router.navigate(['/team', team_id]);
  }
  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }

  onchangefillter_matches(pos) {
    console.log("filter is change", pos);
    this.selectedposition = pos;
  }

}
