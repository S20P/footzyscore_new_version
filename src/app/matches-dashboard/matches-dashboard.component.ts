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
  public comp_id: any;
  public timezone: any;
  public todays_Matches_title: any;
  public localtimezone: any;
  public firstDay_Month: any;
  public lastDay_Month: any;
  public match_ground_details = [];
  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  // public flage_baseUrl: any;

  constructor(
    private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    // this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.firstDay_Month = this.jsCustomeFun.firstDay_Month();
    this.lastDay_Month = this.jsCustomeFun.lastDay_Month();
  }


  ngOnInit() {
    var dm = moment("2014 04 25", "YYYY MM DD");
    console.log("date_momt", dm);
    // console.log("flageurl url is", this.flage_baseUrl);

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
      console.log("APP is now live //socket starting");
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

    console.log("match_ground_details", this.match_ground_details);

  }

  //API GetAllCompetitionMatchesByMonth---

  GetAllCompetitionMatchesByMonth(param) {

    this.matchService.GetAllCompetitionMatchesByMonth(param).subscribe(record => {

      var result: any = record['data'];

      if (result !== undefined) {

        for (var k = 0; k < result.length; k++) {

          var time: any = result[k].time;
          var starting_at: any = time.starting_at;
          var fulldate: any = starting_at.date;
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
      // console.log("record by selected Date", record);
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
          self.comp_id = league_id;
          // self.season = season_name;
          //end self gloab variable----------------

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
