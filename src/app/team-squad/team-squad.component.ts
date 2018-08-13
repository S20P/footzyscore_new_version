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
import * as moment from 'moment-timezone';
import "moment-timezone";
@Component({
  selector: 'app-team-squad',
  templateUrl: './team-squad.component.html',
  styleUrls: ['./team-squad.component.css']
})
export class TeamSquadComponent implements OnInit {
  public SquadTeam = [];
  public team_id: any;
  public team_name: any;
  public team_flage: any;
  public flage_baseUrl: any;
  public array_length: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.flage_baseUrl = "/assets/img/TeamFlage/";

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
    });
    this.array_length = 1;

  }


  ngOnInit() {
    this.SquadTeam = [];
    this.GetSquad();
  }

  GetSquad() {
    this.SquadTeam = [];
    var self = this;
    this.matchService.GetTeamDeatilsById(this.team_id).subscribe(record => {
      console.log("Squad res", record);

      var result: any = record['data'];
      if (result !== undefined) {
        for (let data of result) {
          this.team_name = data.name;
          this.team_flage = data.logo_path;
          var TeamSquad = data['squad'];
          if (TeamSquad !== undefined) {

            var array = TeamSquad.data,
              groups = Object.create(null),
              grouped = [];
            array.forEach(function (item) {

              console.log("item", item);
              var position_id = item.position_id;

              if (position_id !== null) {

                if (!groups[position_id]) {
                  groups[position_id] = [];
                  var position = item['position'];
                  var pos = position.data;
                  console.log("pos", pos);
                  if (pos !== undefined || pos['length'] !== 0 || pos !== null) {
                    var position_name = pos.name;
                    console.log("position_name", position_name);
                    grouped.push({ type: position_name, group: groups[position_id] });
                  }
                }

                var player = item['player'].data;
                var fullname = player.common_name;
                var birthdate: any = player.birthdate;

                console.log("birthdate", birthdate);
                if (birthdate == null) {
                  birthdate = "-";
                  age = "-";
                } else {
                  var a = moment(new Date());
                  var b = moment(birthdate, 'DD/MM/YYYY', true).format();
                  console.log("b", b);
                  var age;
                  age = a.diff(b, 'years');
                }
                console.log("age", age); //

                console.log("full-name", fullname);
                groups[position_id].push({
                  "player_id": item['player_id'],
                  "appearences": item['appearences'],
                  "goals": item['goals'],
                  "name": fullname,
                  "number": item['number'],
                  "age": age
                });
              }
            });

            this.SquadTeam = grouped;
            console.log("Squad_group", grouped);
          }
        }
        this.array_length = this.SquadTeam.length;

      }
      else {
        this.array_length = 0;
      }

    });
  }

  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id]);
  }


}
