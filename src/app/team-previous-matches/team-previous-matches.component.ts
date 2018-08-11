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
  public array_length: any;

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
    this.array_length = 1;

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
      console.log("record GetPreviousMatchesTeamById", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var collection: any = self.jsCustomeFun.HandleDataofAPI(item);

          var id: any = collection['id'];
          var league_id = collection['league_id'];
          var week: any = collection['week'];

          //LocalTeam Data---------------------------------------------------------
          var localteam_id: any = collection['localteam_id'];
          var localteam_name: any = collection['localteam_name'];
          var localteam_image: any = collection['localteam_image'];

          //visitorTeam Data--------------------------------------------------------
          var visitorteam_id: any = collection['visitorteam_id'];
          var visitorteam_name: any = collection['visitorteam_name'];
          var visitorteam_image: any = collection['visitorteam_image'];

          //time---------------------------------------------------------------------
          var live_status: any = collection["live_status"];
          var status: any = collection["status"];
          var match_time: any = collection["match_time"];
          //end time---------------------------------------------------------------------

          //scores----------------------------------------------------------------------
          var localteam_score: any = collection["localteam_score"];
          var visitorteam_score: any = collection["visitorteam_score"];
          var score_status_flage: any = collection["score_status_flage"];
          var penalty_visitor: any = collection["penalty_visitor"];
          var penalty_local: any = collection["penalty_local"];
          //Which team is high scores------------------------------------------
          //*apply class for text-bold=>font-wight:bold if team run is highest
          var ltScore_highest: any = collection["ltScore_highest"];
          var vtScore_highest: any = collection["vtScore_highest"];
          //end scores------------------------------------------

          // AGG (0-0)--------------------------------------------
          var lats_score_local: any = collection["lats_score_local"];
          var lats_score_vist: any = collection["lats_score_vist"];
          var agg_localvist: any = collection['agg_localvist'];
          // end AGG (0-0)-------------------------------------------

          //PEN (0-0)------------------------------------------------
          var penalty_localvist: any = collection["penalty_localvist"];
          //end PEN (0-0)--------------------------------------------

          //venue---------------------------------------------------------
          var venue_id: any = collection['venue_id'];
          var venue_name: any = collection["venue"];
          var venue_city: any = collection["venue_city"];
          //end venue---------------------------------------------------------

          //season---------------------------------------------------------
          var season_id: any = collection['season_id'];
          var season_name = collection['season_name'];
          //end season---------------------------------------------------------
          var competitions = collection['competitions'];

          //self gloab variable----------------
          // self.comp_id = league_id;
          // self.season = season_name;
          //end self gloab variable----------------
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

          if (competitions !== "") {
            if (!groups[competitions.id]) {
              groups[competitions.id] = [];
              grouped.push({ competitions: competitions, group: groups[competitions.id] });
            }

            groups[competitions.id].push({
              "id": id,
              "comp_id": league_id,
              "week": week,
              "venue_id": venue_id,
              "venue": venue_name,
              "venue_city": venue_city,
              "localteam_id": localteam_id,
              "localteam_name": localteam_name,
              "localteam_image": localteam_image,
              "localteam_score": localteam_score,
              "ltScore_highest": ltScore_highest,
              "lats_score_local": lats_score_local,
              "penalty_local": penalty_local,
              "visitorteam_id": visitorteam_id,
              "visitorteam_name": visitorteam_name,
              "visitorteam_image": visitorteam_image,
              "visitorteam_score": visitorteam_score,
              "vtScore_highest": vtScore_highest,
              "lats_score_vist": lats_score_vist,
              "penalty_visitor": penalty_visitor,
              "penalty_localvist": penalty_localvist,
              "agg_localvist": agg_localvist,
              "status": status,
              "time": match_time,
              "formatted_date": match_time,
              "competitions": competitions,
              "live_status": live_status,
              "score_status_flage": score_status_flage,
              "team_w": team_w,
              "team_l": team_l,
              "team_d": team_d,
            });
          }
        });
        console.log("grouped", grouped);
        this.PreviousMatchesTeam = grouped;
        this.array_length = this.PreviousMatchesTeam.length;

      }
      else {
        this.array_length = 0;
      }

    })
  }

  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }
  CompetitionDetails(comp_id) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

}
