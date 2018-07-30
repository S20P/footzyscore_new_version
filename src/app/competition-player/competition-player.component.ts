
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
  selector: 'app-competition-player',
  templateUrl: './competition-player.component.html',
  styleUrls: ['./competition-player.component.css']
})
export class CompetitionPlayerComponent implements OnInit {

  public player_collection = [];
  public comp_id: any;
  public competition_name: any;
  public season: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService
  ) {
    
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
    this.season = season;
    var self = this;
    this.player_collection = [];
    this.matchService.GetAllTopPlayerByCompId(this.comp_id, season).subscribe(data => {
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

              // If you want use Player image use it.
              //public player_baseUrl: any;
             // this.player_baseUrl = "https://s3.amazonaws.com/starapps/footzy/players/";
             // var flag = self.player_baseUrl + teams['player_id'] + ".jpg";
            // "player_flag": flag
           // <img [src]="item_details.player_flag" onError="this.src='assets/img/avt_player.png'" /> 

            groups[type].push({
              "player_id": teams['player_id'],
              "player_name": teams['player'],
              "count": teams['count'],
            });
          }
        });

        this.player_collection = grouped;
        console.log("player_group", grouped);
      }
    });

    console.log("All Tops Player are", this.player_collection);
  }
  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id, { "comp_id": this.comp_id, "season": this.season }]);
  }
}
