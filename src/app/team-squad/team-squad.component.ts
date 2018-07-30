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
      let team_name = params.get("team_name");
      this.team_name = team_name;
    });

  }


  ngOnInit() {
    this.team_flage = this.flage_baseUrl + this.team_id + ".png";
    this.SquadTeam = [];
    this.GetSquad();
  }

  GetSquad() {
    this.SquadTeam = [];
    var self = this;
    this.matchService.GetSquadByTeamId(this.team_id).subscribe(data => {
      console.log("Squad res", data);
      var TeamSquad = data['data'];
      if (TeamSquad !== undefined) {

        var array = TeamSquad,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {

          if (!groups[item.position]) {
            groups[item.position] = [];

            var position_name;

            if (item.position == "A") {
              position_name = "Attacker";
            }
            if (item.position == "D") {
              position_name = "Defender";
            }
            if (item.position == "F") {
              position_name = "Forward";
            }
            if (item.position == "G") {
              position_name = "Goalkeeper";
            }
            if (item.position == "M") {
              position_name = "Midfielder";
            }
            grouped.push({ type: position_name, group: groups[item.position] });
          }
      
          groups[item.position].push({
            "id": item['id'],
            "age": item['age'],
            "appearences": item['appearences'],
            "goals": item['goals'],
            "name": item['name'],
            "number": item['number'],
            "position": item['position']           
          });
        });
        this.SquadTeam = grouped;
        console.log("Squad_group", grouped);
      }
    });
  }

  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id, { "comp_id": "", "season": "" }]);
  }


}
