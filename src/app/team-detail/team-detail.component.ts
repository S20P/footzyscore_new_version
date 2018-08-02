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
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public team_id: any;
  public team_name: any;
  public team_flage: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
      this.GetTeamDeatilsById(id);

    });

  }


  ngOnInit() {
    this.setTimer();
    // this.team_flage = this.flage_baseUrl + this.team_id + ".png";
  }

  GetTeamDeatilsById(team_id) {
    this.matchService.GetTeamDeatilsById(team_id).subscribe(record => {
      //console.log("Teams_Details", record);
      var result: any = record['data'];

      var self = this;
      if (result !== undefined) {
        for (let data of result) {
          this.team_name = data.name;
          this.team_flage = data.logo_path;
        }
      }
    });
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
