
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
  public comp_id: any;
  public competition_name: any;
  public season: any;
  public selectedposition: any;
  public flage_baseUrl: any;

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

    this.flage_baseUrl = "/assets/img/TeamFlage/";

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

  }

  ngOnInit() {
  }

  filterData(i) {
    console.log("position is", i);
    this.matchService.GetAllLeague().subscribe(data => {
      console.log("GetAllCompetitions_list", data);
      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {
          if (item.id == this.comp_id) {
            this.competition_name = item.name;
            for (let r = 0; r < item.availableSeason['length']; r++) {
              if (r == i) {
                this.season = item.availableSeason[i];
                var com = {
                  comp_id: this.comp_id,
                  competition_name: this.competition_name,
                  season: this.season
                }
                this.GetAllCompetitions(com);
              }
            }
          }
        }
      }
    });
  }

  GetAllCompetitions(com) {
    console.log("com", com);
    var season = com.season;

    var list = [];
    this.match_ground_details = [];
    this.list_matches = [];
    this.matchService.GetAllMatchesByWeek(this.comp_id, season).subscribe(data => {
      console.log("GetAllMatchesByWeek", data);
      var result = data['data'];
      var self = this;
      if (result !== undefined) {

        var array = result.reduce((r, { week, formatted_date }, index, arr) => {

          var data = arr[index];
          var last = r[r.length - 1];

          var paramDate = self.jsCustomeFun.SpliteStrDateFormat(data.formatted_date);

          let timezone = paramDate + " " + data.time;
          let match_time = self.jsCustomeFun.ChangeTimeZone(timezone);
          let live_status = self.jsCustomeFun.CompareTimeDate(match_time);

          var flag__loal = self.flage_baseUrl + data.localteam_id + ".png";
          var flag_visit = self.flage_baseUrl + data.visitorteam_id + ".png";


          var selected1 = self.jsCustomeFun.SpliteStrDateFormat(data.formatted_date);
          var date11 = new Date(selected1 + " " + data.time);

          var checkstr = $.isNumeric(week);
          var week;
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

          var visitorteam_score;
          var localteam_score;
          if (data.visitorteam_score == '?') {
            visitorteam_score = "";
            live_status = false;
          } else {
            visitorteam_score = data.visitorteam_score
          }

          if (data.localteam_score == '?') {
            localteam_score = "";
            live_status = false;
          } else {
            localteam_score = data.localteam_score
          }

          // AGG (0-0)--------------------------------------------
          var lats_score_local;
          var lats_score_vist;
          var vscore;
          var lscore;
          if (data.localteam_score == "" || data.localteam_score == null || data.localteam_score == undefined || data.visitorteam_score == "" || data.visitorteam_score == null || data.visitorteam_score == undefined) {
            vscore = 0;
            lscore = 0;
          }
          else {
            vscore = data.visitorteam_score;
            lscore = data.localteam_score;
          }

          if (data.last_score !== "" && data.last_score !== null && data.last_score !== undefined) {
            var ls = data.last_score;
            let string1 = ls.split("-", 2);
            lats_score_local = parseInt(string1[1]) + parseInt(lscore);
            lats_score_vist = parseInt(string1[0]) + parseInt(vscore);
          }
          // end AGG (0-0)-------------------------------------------

          //PEN (0-0)------------------------------------------------
          var penalty_localvist = false;

          if (data.penalty_local !== "" && data.penalty_local !== null && data.penalty_local !== undefined && data.penalty_visitor !== "" && data.penalty_visitor !== null && data.penalty_visitor !== undefined) {
            penalty_localvist = true;
          }
          //end PEN (0-0)--------------------------------------------


          var obj = {
            "comp_id": data.comp_id,
            "et_score": data.et_score,
            "formatted_date": selected1,
            "ft_score": data.ft_score,
            "ht_score": data.ht_score,
            "localteam_id": data.localteam_id,
            "localteam_name": data.localteam_name,
            "localteam_score": localteam_score,
            "localteam_image": flag__loal,
            "penalty_local": data.penalty_local,
            "penalty_visitor": data.penalty_visitor,
            "penalty_localvist": penalty_localvist,
            "season": data.season,
            "status": data.status,
            "time": match_time,
            "venue": data.venue,
            "venue_city": data.venue_city,
            "venue_id": data.venue_id,
            "visitorteam_id": data.visitorteam_id,
            "visitorteam_name": data.visitorteam_name,
            "visitorteam_score": visitorteam_score,
            "visitorteam_image": flag_visit,
            "week": data.week,
            "_id": data._id,
            "id": data.id,
            "live_status": live_status,
            "lats_score_local": lats_score_local,
            "lats_score_vist": lats_score_vist
          };

          if (last && last.week.week === week) {
            last.group.push(obj);
          } else {
            r.push({ week: { week, formatted_date }, group: [obj] });
          }
          return r;
        }, [])

        //console.log(array);


        for (let p = 0; p < array.reverse()['length']; p++) {
          console.log("item_week", array[p].week);
          var post_date = array[p].week.formatted_date;
          console.log("post_date", post_date);

          var dl = self.jsCustomeFun.SpliteStrDateFormat(post_date);
          console.log("dl", dl);

          let timezone = dl + " " + "00:00";
          let trans_date = self.jsCustomeFun.ChangeTimeZone(timezone);

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
            this.selectedposition = pos;
            console.log("pos", pos);

          }
          else {
            this.selectedposition = 0;

          }
        }

        this.match_ground_details = array;

      }
    });

    console.log("All Tops Matches by week are", this.match_ground_details);
    console.log("list dropdown", this.list_matches);


  }



  GetMatchesByCompetition_ById_live() {

    let current_matchId;
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("Live-Matches-data", data);
      var result = data['data'];
      console.log("live data", data['data']['events']);
      // console.log("Matches is Live", data);
      if (result.events !== undefined) {
        var result_events = data['data'].events;
        //   console.log("live_item-data", live_item);
        current_matchId = result_events['id'];
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

    console.log("match_ground_details", this.match_ground_details);

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
