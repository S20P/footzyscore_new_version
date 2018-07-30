
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import {PageScrollConfig} from 'ngx-page-scroll';


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
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
    });

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
  set SelectedSeason(message: number) {
    this.position = message;
    this.filterData(message);
    console.log("perent dropdown select position", this.position);
  }

  ngOnInit() {

  }


  filterData(i) {
    console.log("position is", i);
    this.matchService.GetAllLeague().subscribe(data => {
      console.log("GetAllCompetitions_list", data);
      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {
          if (item.id == this.comp_id) {
            this.competition_name = item.name;
            for (let r = 0; r < item.availableSeason['length']; r++) {

              if (r == i) {
                this.season = item.availableSeason[i];
                var com = {
                  comp_id: this.comp_id,
                  competition_name: this.competition_name,
                  season: this.season
                }
                this.GetAllCompetitions(com);
              }
            }
          }
        }
      }
    });
  }

  GetAllCompetitions(com) {

    console.log("com_", com);
    var season = com.season;

    this.Group_collection = [];

    this.matchService.GetAllCompetitions_ById(this.comp_id, season).subscribe(data => {
      console.log("GetCompetitionStandingById", data);

      var result = data['data'];

      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {

          var item_group;
          if (item.comp_group == null) {
            item_group = "Group"
          }
          else {
            item_group = item.comp_group;
          }


          if (!groups[item_group]) {
            groups[item_group] = [];

            grouped.push({ type: item_group, group: groups[item_group] });
          }

          groups[item_group].push(item);
        });
        this.Group_collection = grouped;
        console.log("Group_collection", grouped);

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
