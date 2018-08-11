
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
  public array_length: any;

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
    this.array_length = 1;

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
    if (season_id) {
      this.GetStandingBySeasonId(season_id);
    }
  }

  GetStandingBySeasonId(season_id) {

    var season_id = season_id;
    this.Group_collection = [];

    this.matchService.GetStandingBySeasonId(season_id).subscribe(record => {
      console.log("GetCompetitionStandingById", record);
      var result = record['data'];
      if (result !== undefined) {

        var array = result;
        if (array !== undefined) {
          var grouped = [];
          var groups = Object.create(null);
          array.forEach(function (item) {
            console.log("item", item);

            var item_group;
            if (item.name == null) {
              item_group = "Group"
            }
            else {
              item_group = item.name;
            }

            if (!groups[item_group]) {
              groups[item_group] = [];
              grouped.push({ type: item_group, group: groups[item_group] });
            }

            var group_data = item['standings'].data;
            for (let row of group_data) {
              var position = row.position;
              var team_name = row.team_name;
              var team_id = row.team_id;
              var overall = row.overall;
              var overall_gp = overall.games_played;
              var overall_w = overall.won;
              var overall_d = overall.draw;
              var overall_l = overall.lost;
              var total = row.total;
              var gd = total.goal_difference;
              var points = row.points;
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
            }
          });
          this.Group_collection = grouped;
          console.log("Group_collection", grouped);
        }

        this.array_length = this.Group_collection.length;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
      }
    });
  }
  teamdetails(team_id) {
    this.router.navigate(['/team', team_id]);
  }
  onchangefillter_group(pos) {
    console.log("filter is change", pos);
    this.selectedpositionofGroup = pos;
  }

}
