import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { DatePipe } from '@angular/common';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';


@Component({
  selector: 'app-stadium-detail',
  templateUrl: './stadium-detail.component.html',
  styleUrls: ['./stadium-detail.component.css']
})
export class StadiumDetailComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  stadium_id;
  stadiumDetail_collecction;
  AllCompetitions = [];
  match_ground_details = [];
  localmatches = [];
  flage_baseUrl = "https://s3.amazonaws.com/starapps/footzy/team/";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService
  ) {

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("Live-Matches-data", data);
      console.log("live data1", data['data']['events']);
      var result = data['data'];
      var events = result.events;
      console.log("live events", events);
      this.GetMatchesByCompetition_ById_live();
    });
  }

  ngOnInit() {
    this.setTimer();
    this.localmatches = [];
    // this.GetLocaltypeMatches();

    this.match_ground_details = [];

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.stadium_id = id;
    });

    this.getStadiumAll();
    this.GetAllCompetitions();
  }
  GetLocaltypeMatches() {
    this.localmatches = [];
    this.matchService.GetStaticMatches().subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.localmatches.push(res[i]);
      }
    });
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

        for (let i = 0; i < this.match_ground_details['length']; i++) {
          if (this.match_ground_details[i].id == current_matchId) {

            var status_offon;

            status_offon = true;

            this.match_ground_details[i]['status'] = item.status;
            this.match_ground_details[i]['localteam_score'] = item.localteam_score;
            this.match_ground_details[i]['visitorteam_score'] = item.visitorteam_score;
            this.match_ground_details[i]['id'] = item.id;
            this.match_ground_details[i]['live_status'] = status_offon;

          }
        }

      }
    });

  }

  public getStadiumAll() {
    console.log("get Stadium record from json");
    this.stadiumDetail_collecction = [];

    // API for get AllStadium Record
    this.matchService.getStadiumAllFromJson().subscribe(data => {

      console.log("Stadium Record for json ", data['Places']);
      var result = data['Places'];
      if (result !== undefined) {
        for (let place of result) {
          if (place.id == this.stadium_id) {
            this.stadiumDetail_collecction.push(place);
          }
        }
      }
    });
    console.log("Stadium_Places", this.stadiumDetail_collecction);
    console.log("");
  }

  GetAllCompetitions() {
    this.GetLocaltypeMatches();

    this.match_ground_details = [];

    this.matchService.GetAllCompetitions().subscribe(data => {
      //console.log("GetAllCompetitions",data);
      this.AllCompetitions = data['data'];
      for (var i = 0; i < this.AllCompetitions.length; i++) {

        this.matchService.GetMatchesByCompetition_ById(this.AllCompetitions[i].id).subscribe(data => {
          console.log("GetMatchesByCompetition_ById", data);

          var result = data['data'];

          if (result !== undefined) {

            for (var j = 0; j < result['length']; j++) {

              if (result[j].venue_id == this.stadium_id) {
                console.log("item is....", result[j]);

                var myString = result[j].formatted_date;
                var fulldate = this.jsCustomeFun.SpliteStrDateFormat(myString);

                //Change UTC timezone to IST(Local)
                let timezone = fulldate + " " + result[j].time;

                let match_time = this.jsCustomeFun.ChangeTimeZone(timezone);

                console.log("time ", match_time);



                var flag__loal = this.flage_baseUrl + result[j].localteam_id + ".png";
                var flag_visit = this.flage_baseUrl + result[j].visitorteam_id + ".png";



                let live_status = this.jsCustomeFun.CompareTimeDate(match_time);

                var selected1 = this.jsCustomeFun.SpliteStrDateFormat(result[j].formatted_date);
                var date11 = new Date(selected1 + " " + result[j].time);

                //   var type = [];
                var match_number;
                var match_type;
                for (let i = 0; i < this.localmatches['length']; i++) {

                  let selected2 = this.jsCustomeFun.SpliteStrDateFormat(this.localmatches[i].formatted_date);

                  var date22 = new Date(selected2 + " " + this.localmatches[i].time);

                  if (date11.getTime() == date22.getTime()) {
                    console.log("data is ok..", this.localmatches[i]);
                    match_number = this.localmatches[i].match_number;
                    match_type = this.localmatches[i].match_type;
                  }
                }

                var status;
                if (result[j].status == "") {
                  status = match_time;
                }
                else {
                  status = result[j].status;
                }

                this.match_ground_details.push({
                  "comp_id": result[j].comp_id,
                  "et_score": result[j].et_score,
                  "formatted_date": result[j].formatted_date,
                  "ft_score": result[j].ft_score,
                  "ht_score": result[j].ht_score,
                  "localteam_id": result[j].localteam_id,
                  "localteam_name": result[j].localteam_name,
                  "localteam_score": result[j].localteam_score,
                  "localteam_image": flag__loal,
                  "penalty_local": result[j].penalty_local,
                  "penalty_visitor": result[j].penalty_visitor,
                  "season": result[j].season,
                  "status": status,
                  "time": match_time,
                  "venue": result[j].venue,
                  "venue_city": result[j].venue_city,
                  "venue_id": result[j].venue_id,
                  "visitorteam_id": result[j].visitorteam_id,
                  "visitorteam_name": result[j].visitorteam_name,
                  "visitorteam_score": result[j].visitorteam_score,
                  "visitorteam_image": flag_visit,
                  "week": result[j].week,
                  "_id": result[j]._id,
                  "id": result[j].id,
                  "live_status": live_status,
                  "match_number": match_number,
                  "match_type": match_type,

                });





              }
            }
          }
        });
      }
    });


    console.log('Match for this Stadium', this.match_ground_details);
  }

  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }

  public setTimer() {

    // set showloader to true to show loading div on view
    this.showloader = true;

    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      // set showloader to false to hide loading div from view after 5 seconds
      this.showloader = false;
    });
  }
}
