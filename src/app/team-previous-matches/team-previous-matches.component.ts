import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { DatePipe } from '@angular/common';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import * as moment from 'moment-timezone';
import "moment-timezone";
@Component({
  selector: 'app-team-previous-matches',
  templateUrl: './team-previous-matches.component.html',
  styleUrls: ['./team-previous-matches.component.css']
})
export class TeamPreviousMatchesComponent implements OnInit {
  public PreviousMatchesTeam = [];
  public team_id: any;
  public team_name: any;
  public team_flage: any;
  public flage_baseUrl: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
      let team_name = params.get("team_name");
      this.team_name = team_name;
    });

  }


  ngOnInit() {

    this.team_flage = this.flage_baseUrl + this.team_id + ".png";
    this.PreviousMatchesTeam = [];
    this.GetPreviousMatches();

  }


  GetPreviousMatches() {
    this.PreviousMatchesTeam = [];

    for (let i = 0; i < this.PreviousMatchesTeam['length']; i++) {
      this.PreviousMatchesTeam.splice(i, 1);
    }

    let team_id = this.team_id;
    this.matchService.GetPreviousMatchesTeamById(team_id).subscribe(record => {
      console.log("record by selected Date", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {

          console.log("todays matches item", item);

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
          let match_time: any = self.jsCustomeFun.ChangeTimeZone(date_time);
          var status: any = time.status;
          var time_formatte = moment(new Date(match_time)).format('hh:mm a');

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
            score_status_flage = false;
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
            venue_data = item['venue'].data;
            venue_name = venue_data.name;
            venue_city = venue_data.city;
          }
          //end venue---------------------------------------------------------

          //season---------------------------------------------------------
          var season_id: any = item['season_id'];
          //end season---------------------------------------------------------

          //Win and loss----------------------------------------------------------
          var team_w = false;
          var team_l = false;
          var team_d = false;

          if (team_id == localteam_id) {
            if (localteam_score > visitorteam_score) {
              team_w = true;
              team_l = false;
            }
            if (localteam_score < visitorteam_score) {
              team_l = true;
              team_w = false;
            }
            if (localteam_score == visitorteam_score) {
              team_d = true;
            }
          }

          if (team_id == visitorteam_id) {
            if (visitorteam_score > localteam_score) {
              team_w = true;
              team_l = false;
            }
            if (visitorteam_score < localteam_score) {
              team_l = true;
              team_w = false;
            }
            if (localteam_score == visitorteam_score) {
              team_d = true;
            }
          }


          //end Win and loss----------------------------------------------------------

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
            "vtScore_highest": vtScore_highest,
            "team_w": team_w,
            "team_l": team_l,
            "team_d": team_d,
          });
        });
        console.log("grouped", grouped);
        this.PreviousMatchesTeam = grouped;
      }
    })

  }

  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }
  CompetitionDetails(comp_id, comp_name, season) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id, { "comp_name": comp_name, "season": season }]);
  }

}
