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
      console.log("PreviousMatches res", record);

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
          if (!groups[competitions.id]) {
            groups[competitions.id] = [];
            grouped.push({ competitions: competitions, group: groups[competitions.id] });
          }


          //Win and loss----------------------------------------------------------
          var team_w = false;
          var team_l = false;
          var team_d = false;

          if (team_id == localteam_id) {
            if (localteam_score > visitorteam_score) {
              team_w = true;
            }
            if (localteam_score < visitorteam_score) {
              team_l = true;
            }
          }

          if (team_id == visitorteam_id) {
            if (visitorteam_score > localteam_score) {
              team_w = true;
            }
            if (visitorteam_score < localteam_score) {
              team_l = true;
            }
          }

          if (item.localteam_score == item.visitorteam_score) {
            team_d = true;
          }
          //end Win and loss----------------------------------------------------------

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
            "live_status": live_status,
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
