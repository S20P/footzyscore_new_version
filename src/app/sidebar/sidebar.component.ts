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
  public flage_baseUrl: any;
  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
  }

  ngOnInit() {

    this.match_ground_details = [];
    var dateofday = Date();

    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

    console.log("today side bar", currentdaydate);
    this.GetMatchesByDate(currentdaydate);
    this.currentdaydate = currentdaydate;
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
              group[i]['status'] = item.status;
              group[i]['localteam_score'] = item.localteam_score;
              group[i]['visitorteam_score'] = item.visitorteam_score;
              group[i]['id'] = item.id;
              group[i]['live_status'] = status_offon;
            }
          }
        }
      }
    });
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
      console.log("record by selected Date", record);

      var result = record['data'];

      var self = this;

      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {

          let timezone = selected + " " + item.time;
          let match_time = self.jsCustomeFun.ChangeTimeZone(timezone);
          let live_status = self.jsCustomeFun.CompareTimeDate(match_time);

          var flag__loal = self.flage_baseUrl + item.localteam_id + ".png";
          var flag_visit = self.flage_baseUrl + item.visitorteam_id + ".png";



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
            grouped.push({ competitions: competitions, group: groups[competitions.id] });
          }
          groups[competitions.id].push({
            "comp_id": item.comp_id,
            "et_score": item.et_score,
            "formatted_date": item.formatted_date,
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
            "lats_score_local": lats_score_local,
            "lats_score_vist": lats_score_vist
          });
        });
        console.log("grouped", grouped);
        this.match_ground_details = grouped;
      }
    })


    console.log("filter-date_data", this.match_ground_details);

  }

  CompetitionDetails(comp_id) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

  matchdetails_go(id) {
    this.router.navigate(['/matches', id]);
  }
}
