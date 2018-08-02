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
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
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
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public localtimezone: any;
  public firstDay_Month: any;
  public lastDay_Month: any;
  public comp_id: any;
  public competition_name: any;
  public season_id;
  public position;
  public season_group;
  public season_list = [];

  previousUrl: string;
  constructor(
    private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService) {

    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.firstDay_Month = this.jsCustomeFun.firstDay_Month();
    this.lastDay_Month = this.jsCustomeFun.lastDay_Month();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
      this.GetAllCompetitions_list();
    });
  }

  ngOnInit() {
    this.season_list = [];
    this.setTimer();
    this.GetSeason_byleague();
  }


  GetAllCompetitions_list() {

    this.matchService.GetAllLeague().subscribe(record => {
      //console.log("GetAllCompetitions_list", record);
      var result = record['data'];
      if (result !== undefined) {
        for (let item of result) {
          if (item.id == this.comp_id) {
            this.competition_name = item.name;
          }
        }
      }
    });
  }

  GetSeason_byleague() {
    this.season_list = [];

    this.matchService.GetSeasonByLeagueId(this.comp_id).subscribe(record => {
      //console.log("season_list_by_league", record);
      var result = record['data'];
      if (result !== undefined) {
        for (let i = 0; i < result['length']; i++) {

          if (this.comp_id == result[i].league_id) {

            this.season_list.push({
              "id": result[i].id,
              "name": result[i].name,
              "is_current_season": result[i].is_current_season
            });

            if (result[i].is_current_season == true) {
              this.position = i;
              this.season_id = result[i].id;
              //console.log("season_id", this.season_id);
              var season_name = result[i].name;
              this.season_group = { "season_id": this.season_id, "season_name": season_name }
            }
          }
        }
      }
    });

    //console.log("season_list", this.season_list);

  }

  onchangefillter(pos, season_id, season_name) {
    //console.log("filter is change", pos);
    //console.log("Selected season_id is ", season_id);
    this.position = pos;
    this.season_id = season_id;
    this.season_group = { "season_id": season_id, "season_name": season_name }
  }

  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }







}
