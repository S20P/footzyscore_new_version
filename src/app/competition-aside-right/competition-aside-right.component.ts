
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
  selector: 'app-competition-aside-right',
  templateUrl: './competition-aside-right.component.html',
  styleUrls: ['./competition-aside-right.component.css']
})
export class CompetitionAsideRightComponent implements OnInit {

  match_ground_details = [];
  public comp_id: any;
  public competition_name: any;
  // public flage_baseUrl: any;
  public currentdaydate: any;
  public localtimezone: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService,
    private liveMatchesApiService: MatchesApiService,

  ) {

    // this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

  }

  ngOnInit() {
    console.log("-------------------aside-----------------");
    var dateofday = Date();
    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
    this.currentdaydate = currentdaydate;
    console.log("Todays Date is ", this.currentdaydate);
    this.GetAllCompetitions(this.currentdaydate);


    this.matchService.GetAllLeague().subscribe(data => {
      console.log("GetAllCompetitions_list", data);
      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {
          if (item.id == this.comp_id) {
            this.competition_name = item.name;
          }
        }
      }
    });

  }


  GetAllCompetitions(selected) {

    this.match_ground_details = [];
    for (let i = 0; i < this.match_ground_details['length']; i++) {
      this.match_ground_details.splice(i, 1);
    }


    var param = {
      "date": selected,
      "localtimezone": this.localtimezone
    }

    this.matchService.GetAllCompetitionMatchesByDate(param).subscribe(record => {
      console.log("record by selected Date", record);

      var result: any = record;
      var self = this;

      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var id: any = item['id'];
          var comp_id = item['league_id'];

          var stage: any = item['stage'];
          var week: any = stage['data'].name;

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
          let match_time: any = this.jsCustomeFun.ChangeTimeZone(date_time);
          var status: any = time.status;
          var live_status: any = this.jsCustomeFun.CompareTimeDate(match_time);
          //end time---------------------------------------------------------------------

          //scores-------------------------------------------------------------------
          var scores: any = item['scores'];
          var ht_score: any = scores.ht_score;
          var ft_score: any = scores.ft_score;
          var et_score: any = scores.et_score;
          var localteam_score: any = scores.localteam_score;
          var visitorteam_score: any = scores.visitorteam_score;
          if (localteam_score == '?') {
            localteam_score = "";
            live_status = false;
          } else {
            localteam_score = localteam_score;
          }
          if (visitorteam_score == '?') {
            visitorteam_score = "";
            live_status = false;
          } else {
            visitorteam_score = visitorteam_score;
          }
          var penalty_visitor: any = scores.visitorteam_pen_score;
          var penalty_local: any = scores.localteam_pen_score;
          //end scores------------------------------------------


          // AGG (0-0)--------------------------------------------
          var aggregate_id: any = item['aggregate_id'];
          var lats_score_local;
          var lats_score_vist;
          if (aggregate_id !== null) {
            var aggregate_data = item['aggregate'].data;
            var agg_result = aggregate_data.result;
            var vscore;
            var lscore;
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
          }
          // end AGG (0-0)-------------------------------------------


          //PEN (0-0)------------------------------------------------
          var penalty_localvist = false;
          if (penalty_local !== "" && penalty_local !== null && penalty_local !== undefined && penalty_visitor !== "" && penalty_visitor !== null && penalty_visitor !== undefined) {
            penalty_localvist = true;
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
          var season_data;
          var season_name;
          var season_city;
          if (season_id !== null) {
            season_data = item['season'].data;
            season_name = season_data.name;
            season_city = season_data.city;
          }
          //end season---------------------------------------------------------


          var competitions = item.league['data'];

          if (competitions.id == self.comp_id) {

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
              "season": season_name,
              "season_city": season_city,
              "week": week,
              "live_status": live_status
            });
          }
        });
        console.log("grouped", grouped);
        this.match_ground_details = grouped;
      }
    })

    console.log("All Tops Matches by week are", this.match_ground_details);

  }



  GetMatchesByCompetition_ById_live() {
    let current_matchId;
    this.liveMatchesApiService.liveMatches().subscribe(data => {

      console.log("Live-Matches-data", data);
      var result = data['data'];
      console.log("live data", data['data']['events']);
      console.log("Matches is Live", data);
      if (result.events !== undefined) {
        var result_events = data['data'].events;
        current_matchId = result_events['id'];
        //   this.live_rcord.push(result_events);
        var item = result_events;

        for (let j = 0; j < this.match_ground_details['length']; j++) {
          console.log("**", this.match_ground_details[j]);
          var group = this.match_ground_details[j].group;

          for (let i = 0; i < group['length']; i++) {
            if (group[i].id == current_matchId) {
              console.log("group[i].id", group[i].id);
              console.log("current_matchId", current_matchId);
              var status_offon;
              status_offon = true;
              var visitorteam_score;
              var localteam_score;
              if (item.visitorteam_score == '?') {
                visitorteam_score = "";
                status_offon = false;
              } else {
                visitorteam_score = item.visitorteam_score;
                status_offon = true;
              }

              if (item.localteam_score == '?') {
                localteam_score = "";
                status_offon = false;
              } else {
                localteam_score = item.localteam_score;
                status_offon = true;
              }
              group[i]['status'] = item.status;
              group[i]['localteam_score'] = localteam_score;
              group[i]['visitorteam_score'] = visitorteam_score;
              group[i]['id'] = item.id;
              group[i]['live_status'] = status_offon;
            }
          }
        }
      }
    });
  }


  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }



}
