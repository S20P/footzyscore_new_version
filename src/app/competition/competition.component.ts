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
  public season: any;
  public position: number = 0;

  public Competition_list: any;

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
    this.Competition_list = [];
    this.setTimer();
  }


  GetAllCompetitions_list() {

    this.Competition_list = [];
    this.matchService.GetAllLeague().subscribe(data => {
      console.log("GetAllCompetitions_list", data);
      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {
          if (item.id == this.comp_id) {
            this.competition_name = item.name;
            this.Competition_list.push(item);
          }
        }
      }
    });
    console.log("current selected compitation", this.Competition_list);
  }

  onchangefillter(pos) {
    console.log("filter is change", pos);
    this.position = pos;
  }

  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }







}
