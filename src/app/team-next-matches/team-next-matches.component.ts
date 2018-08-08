import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import * as moment from 'moment-timezone';
import "moment-timezone";
import { DatePipe } from '@angular/common';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

@Component({
  selector: 'app-team-next-matches',
  templateUrl: './team-next-matches.component.html',
  styleUrls: ['./team-next-matches.component.css']
})
export class TeamNextMatchesComponent implements OnInit {

  public NextMatchesTeam = [];
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

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

  }


  ngOnInit() {
    this.team_flage = this.flage_baseUrl + this.team_id + ".png";
    this.NextMatchesTeam = [];
    this.GetNextMatches();
  }

  GetNextMatches() {

    this.NextMatchesTeam = [];

    for (let i = 0; i < this.NextMatchesTeam['length']; i++) {
      this.NextMatchesTeam.splice(i, 1);
    }
    this.matchService.GetNextMatchesTeamById(this.team_id).subscribe(record => {
      console.log("record by selected Date", record);
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
          //self.comp_id = league_id;
          // self.season = season_name;
          //end self gloab variable----------------
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
              "score_status_flage": score_status_flage
            });
          }
        });
        console.log("grouped", grouped);
        this.NextMatchesTeam = grouped;
      }
    })

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
        for (let j = 0; j < this.NextMatchesTeam['length']; j++) {
          console.log("**", this.NextMatchesTeam[j]);
          var group = this.NextMatchesTeam[j].group;

          for (let i = 0; i < group['length']; i++) {
            if (group[i].id == current_matchId) {

              var collection: any = this.jsCustomeFun.HandleDataofAPI(item);

              var id: any = collection['id'];
              //time---------------------------------------------------------------------
              var live_status: any = collection["live_status"];
              var status: any = collection["status"];

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
              //PEN (0-0)------------------------------------------------
              var penalty_localvist: any = collection["penalty_localvist"];
              //end PEN (0-0)--------------------------------------------

              group[i]['id'] = id;
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

    console.log("NextMatchesTeam", this.NextMatchesTeam);

  }



  CompetitionDetails(comp_id, comp_name, season) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id, { "comp_name": comp_name, "season": season }]);
  }


  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }


}
