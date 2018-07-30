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
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import { concat } from 'rxjs/operators';


@Component({
  selector: 'app-matches-dashboard',
  templateUrl: './matches-dashboard.component.html',
  styleUrls: ['./matches-dashboard.component.css']
})

export class MatchesDashboardComponent implements OnInit {
  public paramDate: any;
  public message: string;
  public messages = [];
  public alldaymatch_list = [];

  public timezone: any;
  public todays_Matches_title: any;
  public localtimezone: any;
  public firstDay_Month: any;
  public lastDay_Month: any;
  public match_ground_details = [];
  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  public flage_baseUrl: any;

  constructor(
    private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.firstDay_Month = this.jsCustomeFun.firstDay_Month();
    this.lastDay_Month = this.jsCustomeFun.lastDay_Month();

  }


  ngOnInit() {

    console.log("flageurl url is", this.flage_baseUrl);

    this.match_ground_details = [];

    this.setTimer();

    this.dateSchedule_ini();

    $('#datepicker').datepicker();
    $('#datepicker').datepicker('setDate', 'today');

    var today = $('#datepicker').val();
    this.paramDate = today;

    console.log("today", this.paramDate);
    this.todays_Matches_title = today;

    var dateofday = Date();
    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);

    this.GetMatchesByDate(this.paramDate);

    let self = this;

    $("#datepicker").on("change", function () {
      var selected = $(this).val();
      console.log("date is one", selected);
      self.paramDate = selected;
      self.todays_Matches_title = selected;
      console.log("date is currentdaydate", currentdaydate);
      self.GetMatchesByDate(self.paramDate);
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

    var param = {
      "firstDay": this.firstDay_Month,
      "lastDay": this.lastDay_Month,
      "localtimezone": this.localtimezone
    }

    this.GetAllCompetitionMatchesByMonth(param);




  }


  //Render date in datepicker
  dateSchedule_ini() {
    var self = this;
    var array = this.alldaymatch_list;

    $('#datepicker').datepicker({
      inline: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      beforeShowDay: function (date) {
        var string = $.datepicker.formatDate('yy-mm-dd', date);
        if (array.indexOf(string) != -1) {
          return [true];
        }
        return [true, "highlight", string];
      },

      onChangeMonthYear: function (dateText, inst, dateob) {

        var navidatedMonth = new Date(dateob.selectedYear, dateob.selectedMonth, dateob.selectedDay)
        var firstDay = new Date(navidatedMonth.getFullYear(), navidatedMonth.getMonth(), 1);
        var lastDay = new Date(navidatedMonth.getFullYear(), navidatedMonth.getMonth() + 1, 0);

        var firstDay_formate = moment(firstDay).format("YYYY-MM-DD");
        var lastDay_formate = moment(lastDay).format("YYYY-MM-DD");

        var param = {
          "firstDay": firstDay_formate,
          "lastDay": lastDay_formate,
          "localtimezone": self.localtimezone
        };

        self.GetAllCompetitionMatchesByMonth(param);

      }
    });

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
              group[i]['status'] = item.status;

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

  //API GetAllCompetitionMatchesByMonth---

  GetAllCompetitionMatchesByMonth(param) {

    this.matchService.GetAllCompetitionMatchesByMonth(param).subscribe(record => {

      var result = record['data'];

      if (result !== undefined) {
        for (var k = 0; k < result.length; k++) {
          let myString = result[k].formatted_date;
          let fulldate = this.jsCustomeFun.SpliteStrDateFormat(myString);
          //I have a simple case of pushing unique values into array.
          if (this.alldaymatch_list.indexOf(fulldate) == -1) {
            this.alldaymatch_list.push(fulldate);
          }
          this.loadjquery();
        }
      }
    });

    console.log("short List of Date by Month", this.alldaymatch_list);

  }

  GetMatchesByDate(paramDate) {
    this.todays_Matches_title = paramDate;
    this.match_ground_details = [];

    for (let i = 0; i < this.match_ground_details['length']; i++) {
      this.match_ground_details.splice(i, 1);
    }
    console.log("Selected short date is", paramDate);

    var param = {
      "date": paramDate,
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

          let timezone = paramDate + " " + item.time;
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
            visitorteam_score = item.visitorteam_score;
          }

          if (item.localteam_score == '?') {
            localteam_score = "";
            live_status = false;
                     } else {
            localteam_score = item.localteam_score;
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
            "competitions": item.competitions,
            "lats_score_local": lats_score_local,
            "lats_score_vist": lats_score_vist
          });
        });
        console.log("grouped", grouped);
        this.match_ground_details = grouped;
      }
    })
  }


  CompetitionDetails(comp_id, comp_name, season) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id, { "comp_name": comp_name, "season": season }]);
  }

  matchdetails(id) {
    this.router.navigate(['/matches', id]);
    //  this.router.navigate(['/matches',id], { queryParams: comp_id, skipLocationChange: true});
  }

  loadjquery() {
    setTimeout(function () {
      $("#datepicker").datepicker("refresh");
    }, 1);
  }

  sendMessage() {
    let msg = this.matchesApiService.sendMessage(this.message);
    this.message = '';
  }
  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }




}
