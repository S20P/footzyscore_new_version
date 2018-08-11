
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
  public array_length: any;


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
    this.array_length = 1;

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
            if (competitions.id == self.comp_id) {

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
          }
        });
        console.log("grouped", grouped);
        this.match_ground_details = grouped;
        this.array_length = this.match_ground_details.length;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
      }

    })
    console.log("All Tops Matches by week are", this.match_ground_details);
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

              // AGG (0-0)--------------------------------------------
              var lats_score_local: any = collection["lats_score_local"];
              var lats_score_vist: any = collection["lats_score_vist"];
              var agg_localvist: any = collection['agg_localvist'];
              // end AGG (0-0)-------------------------------------------

              group[i]['id'] = id;
              group[i]['status'] = status;
              group[i]['live_status'] = live_status;
              group[i]['localteam_score'] = localteam_score;
              group[i]['visitorteam_score'] = visitorteam_score;
              group[i]['score_status_flage'] = score_status_flage;
              group[i]['ltScore_highest'] = ltScore_highest;
              group[i]['vtScore_highest'] = vtScore_highest;
              //agg---
              group[i]['lats_score_local'] = lats_score_local;
              group[i]['lats_score_vist'] = lats_score_vist;
              group[i]['agg_localvist'] = agg_localvist;
              //end egg        

            }
          }
        }
      }
    });

    console.log("match_ground_details", this.match_ground_details);

  }


  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }



}
