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

      var result = record['data'];

      var self = this;



      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var paramDate = self.jsCustomeFun.SpliteStrDateFormat(item.formatted_date);
          let timezone = paramDate + " " + item.time;
          let match_time = self.jsCustomeFun.ChangeTimeZone(timezone);
          let live_status = self.jsCustomeFun.CompareTimeDate(match_time);

          var flag__loal = self.flage_baseUrl + item.localteam_id + ".png";
          var flag_visit = self.flage_baseUrl + item.visitorteam_id + ".png";

          var team_w = false;
          var team_l = false;
          var team_d = false;

          if (team_id == item.localteam_id) {

            if (item.localteam_score > item.visitorteam_score) {
              team_w = true;
            }
            if (item.localteam_score < item.visitorteam_score) {
              team_l = true;
            }
          }

          if (team_id == item.visitorteam_id) {

            if (item.visitorteam_score > item.localteam_score) {
              team_w = true;
            }
            if (item.visitorteam_score < item.localteam_score) {
              team_l = true;
            }

          }

          if (item.localteam_score == item.visitorteam_score) {
            team_d = true;
          }



          var selected1 = self.jsCustomeFun.SpliteStrDateFormat(item.formatted_date);
          var date11 = new Date(selected1 + " " + item.time);

          // AGG (0-0)--------------------------------------------
          var lats_score_local;
          var lats_score_vist;
          var vscore;
          var lscore;
          if (item.localteam_score == "" || item.localteam_score == null || item.localteam_score == undefined || item.visitorteam_score == "" || item.visitorteam_score == null || item.visitorteam_score == undefined) {
            vscore = 0;
            lscore = 0;
          }
          else {
            vscore = item.visitorteam_score;
            lscore = item.localteam_score;
          }

          if (item.last_score !== "" && item.last_score !== null && item.last_score !== undefined) {
            var ls = item.last_score;
            let string1 = ls.split("-", 2);
            lats_score_local = parseInt(string1[1]) + parseInt(lscore);
            lats_score_vist = parseInt(string1[0]) + parseInt(vscore);
          }
          // end AGG (0-0)-------------------------------------------

          //PEN (0-0)------------------------------------------------
          var penalty_localvist = false;

          if (item.penalty_local !== "" && item.penalty_local !== null && item.penalty_local !== undefined && item.penalty_visitor !== "" && item.penalty_visitor !== null && item.penalty_visitor !== undefined) {
            penalty_localvist = true;
          }
          //end PEN (0-0)--------------------------------------------

          var visitorteam_score;
          var localteam_score;
          if (item.visitorteam_score == '?') {
            visitorteam_score = "";
            live_status = false;
          } else {
            visitorteam_score = item.visitorteam_score
          }

          if (item.localteam_score == '?') {
            localteam_score = "";
            live_status = false;
          } else {
            localteam_score = item.localteam_score
          }

          var competitions = item.competitions;

          if (!groups[competitions.id]) {
            groups[competitions.id] = [];
            grouped.push({ type: competitions, group: groups[competitions.id] });
          }
          groups[competitions.id].push({
            "comp_id": item.comp_id,
            "et_score": item.et_score,
            "formatted_date": selected1,
            "ft_score": item.ft_score,
            "ht_score": item.ht_score,
            "localteam_id": item.localteam_id,
            "localteam_name": item.localteam_name,
            "localteam_score": localteam_score,
            "localteam_image": flag__loal,
            "penalty_local": item.penalty_local,
            "penalty_visitor": item.penalty_visitor,
            "penalty_localvist": penalty_localvist,
            "season": item.season,
            "status": item.status,
            "time": match_time,
            "venue": item.venue,
            "venue_city": item.venue_city,
            "venue_id": item.venue_id,
            "visitorteam_id": item.visitorteam_id,
            "visitorteam_name": item.visitorteam_name,
            "visitorteam_score": visitorteam_score,
            "visitorteam_image": flag_visit,
            "week": item.week,
            "_id": item._id,
            "id": item.id,
            "live_status": live_status,
            "competitions": item.competitions,
            "team_w": team_w,
            "team_l": team_l,
            "team_d": team_d,
            "lats_score_local": lats_score_local,
            "lats_score_vist": lats_score_vist
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
