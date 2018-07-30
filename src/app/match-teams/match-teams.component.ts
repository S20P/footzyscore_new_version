import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import * as moment from 'moment-timezone';
import "moment-timezone";

@Component({
  selector: 'app-match-teams',
  templateUrl: './match-teams.component.html',
  styleUrls: ['./match-teams.component.css']
})
export class MatchTeamsComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  AllCompetitions = [];
  teams_collection = [];

  localtimezone;
  firstDay_Month;
  lastDay_Month;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {

    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.firstDay_Month = this.jsCustomeFun.firstDay_Month();
    this.lastDay_Month = this.jsCustomeFun.lastDay_Month();

  }

  ngOnInit() {
    this.setTimer();
    this.localtimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.GetAllCompetitions();
  }

  GetAllCompetitions() {

    var Competitions = [];
    var key = [];


    var team_key = [];
    var param = {
      "firstDay": this.firstDay_Month,
      "lastDay": this.lastDay_Month,
      "localtimezone": this.localtimezone
    }

    this.matchService.GetAllCompetitionMatchesByMonth(param).subscribe(data => {

      var result = data['data'];

      if (result !== undefined) {

        for (var k = 0; k < result.length; k++) {


          var com = result[k].competitions;

          if (key.indexOf(com['id']) == -1) {

            this.matchService.GetAllTopTeamByCompId(com['id'], com['season']).subscribe(data => {
              console.log("GetAllTopTeamByCompId", data);

              var result = data['data'];

              if (result !== undefined) {
                for (let items of result) {
                  console.log("team-item", items);

                  var detailsOfTeam = items['data'];
                  for (let teams of detailsOfTeam) {
                    var Teamflag = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + teams['teamid'] + ".png";

                    if (team_key.indexOf(teams['teamid']) == -1) {



                      this.teams_collection.push({
                        "team_id": teams['teamid'],
                        "team_name": teams['teamname'],
                        "team_flag": Teamflag
                      });

                      team_key.push(teams['teamid']); // push value to key
                    } else {

                    }

                  }
                }
              }

            });
            key.push(com['id']); // push value to key
          } else {

          }
        }
      }
    });

    console.log("?Teams--", this.teams_collection);
  }
  teamdetails(team_id,team_name) {
    this.router.navigate(['/team', team_id,{ "team_name": team_name }]);
  }

  public setTimer() {
    this.showloader = true;
    $('#dd').refresh;
    this.timer = Observable.timer(2000);
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}
