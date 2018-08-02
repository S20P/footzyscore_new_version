
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { PageScrollConfig } from 'ngx-page-scroll';


import { OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';


@Component({
  selector: 'app-competition-group',
  templateUrl: './competition-group.component.html',
  styleUrls: ['./competition-group.component.css']
})
export class CompetitionGroupComponent implements OnInit {
  public position: number;
  public Group_collection = [];
  public comp_id: any;
  public competition_name: any;
  public season: any;
  public selectedpositionofGroup: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService
  ) {
    this.selectedpositionofGroup = 0;

    PageScrollConfig.defaultScrollOffset = 80;
    PageScrollConfig.defaultEasingLogic = {
      ease: (t: number, b: number, c: number, d: number): number => {
        // easeInOutExpo easing
        if (t === 0) return b;
        if (t === d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    };



  }
  @Input()
  set SelectedSeason(message) {
    console.log("message", message);
    if (message !== undefined) {
      this.position = message.season_id;
      this.season = message.season_name;
      this.filterData(message.season_id);
      console.log("perent dropdown select position", this.position);
    }
  }

  ngOnInit() {
  }

  filterData(season_id) {
    this.GetStandingBySeasonId(season_id);
  }

  GetStandingBySeasonId(season_id) {

    var season_id = season_id;
    this.Group_collection = [];

    this.matchService.GetStandingBySeasonId(season_id).subscribe(record => {
      console.log("GetCompetitionStandingById", record);
      var result = record['data'];
      if (result !== undefined) {
        for (let standings_collect of result) {
          var array = standings_collect['standings'].data;

          if (array !== undefined) {

            var groups = Object.create(null),
              grouped = [];

            array.forEach(function (item) {

              var position = item.position;
              var team_name = item.team_name;
              var team_id = item.team_id;
              var overall = item.overall;
              var overall_gp = overall.games_played;
              var overall_w = overall.won;
              var overall_d = overall.draw;
              var overall_l = overall.lost;
              var total = item.total;
              var gd = total.goal_difference;
              var points = item.points;
              var item_group: any;

              if (item.group_name == null) {
                item_group = "Group"
              }
              else {
                item_group = item.group_name;
              }

              if (!groups[item_group]) {
                groups[item_group] = [];
                grouped.push({ type: item_group, group: groups[item_group] });
              }

              groups[item_group].push({
                "position": position,
                "team_id": team_id,
                "team_name": team_name,
                "overall_gp": overall_gp,
                "overall_w": overall_w,
                "overall_d": overall_d,
                "overall_l": overall_l,
                "gd": gd,
                "points": points
              });
            });
            this.Group_collection = grouped;
            console.log("Group_collection", grouped);
          }
        }
      }
    });
  }
  teamdetails(team_id, team_name) {
    this.router.navigate(['/team', team_id, { "team_name": team_name }]);
  }


  onchangefillter_group(pos) {
    console.log("filter is change", pos);
    this.selectedpositionofGroup = pos;
  }

}
