
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

@Component({
  selector: 'app-competition-teams',
  templateUrl: './competition-teams.component.html',
  styleUrls: ['./competition-teams.component.css']
})
export class CompetitionTeamsComponent implements OnInit {
  public teams_collection = [];

  public comp_id: any;
  public competition_name: any;
  public season: any;

  public flage_baseUrl: any;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService
  ) {
    this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
    });
  }
  @Input()
  set SelectedSeason(message: number) {
    this.filterData(message);
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
    var season = com.season;
    this.teams_collection = [];
    var self = this;
    this.matchService.GetAllTopTeamByCompId(this.comp_id, season).subscribe(data => {
      console.log("GetAllTopTeamByCompId", data);
      var result = data['data'];

      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];
        array.forEach(function (item) {
          var type = item.type;
          var detailsOfTeam = item.data;

          if (!groups[type]) {
            groups[type] = [];
            grouped.push({ type: type, group: groups[type] });
          }
          for (let teams of detailsOfTeam) {
            var Teamflag = self.flage_baseUrl + teams['teamid'] + ".png";
            groups[type].push({
              "team_id": teams['teamid'],
              "team_name": teams['teamname'],
              "count": teams['count'],
              "team_flag": Teamflag
            });
          }
        });

        this.teams_collection = grouped;
        console.log("ggggg", grouped);
      }
    });

    console.log("All Tops Teams are", this.teams_collection);
  }
  teamdetails(team_id, team_name) {
    this.router.navigate(['/team', team_id, { "team_name": team_name }]);
  }
}
