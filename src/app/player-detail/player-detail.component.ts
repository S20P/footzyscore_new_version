import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import * as moment from 'moment-timezone';
import "moment-timezone";

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  public player_collection = [];
  public playerStats_collection = [];
  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public player_id: any;
  public player_status: boolean;
  public player_collection_length: any;
  public playerStats_collection_length: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.player_collection_length = 1;
    this.playerStats_collection_length = 1;
  }

  ngOnInit() {
    this.setTimer();

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.player_id = id;
    });
    this.PlayerDetails();
  }

  PlayerDetails() {
    this.showloader = true;

    this.player_collection = [];
    this.playerStats_collection = [];

    let player_id = this.player_id;
    this.matchService.GetPlayerDeatilsById(player_id).subscribe(record => {
      console.log("Player_Details", record);
      var result: any = record['data'];
      this.player_status = record['success'];
      var goals = "-";
      if (result !== undefined) {
        for (let player of result) {
          var player_image_path: any = player['image_path'];
          var player_id: any = player['id'];
          //age *Find age beetwen two dates-------------------
          var age: any;
          var birthdate: any = player['birthdate'];

          var birthdate_formatte;

          if (birthdate == null) {
            birthdate = "-";
            age = "-";
            birthdate_formatte = "-";
          } else {
            var a = moment(new Date());
            var b = moment(birthdate, 'DD/MM/YYYY', true).format();
            console.log("b", b);
            birthdate_formatte = moment(birthdate, 'DD/MM/YYYY', true).format('MMM DD, YYYY');
            var age;
            age = a.diff(b, 'years');
          }

          //end age------------------------------------------
          var birthcountry: any = player['birthcountry'];
          var birthplace = player['birthplace'];
          var fullname: any = player['fullname'];
          var common_name: any = player['common_name'];
          var firstname: any = player['firstname'];
          var lastname: any = player['lastname'];
          var nationality: any = player['nationality'];
          var team_id: any = player['team_id'];
          var weight: any = player['weight'];
          var height: any = player['height'];
          var team_name;

          var team_details: any = player['team'];

          if (team_details) {
            var team: any = player['team'].data;
            if (team !== undefined || team['length'] !== 0 || team !== null) {
              team_name = team.name;
            }
            else {
              team_name = "-";
            }
          } else {
            team_name = "-";
          }

          if (birthcountry == null) {
            birthcountry = "-";
          }
          if (birthplace == null) {
            birthplace = "-";
          }
          if (fullname == null) {
            fullname = "-";
          }
          if (common_name == null) {
            common_name = "-";
          }
          if (firstname == null) {
            firstname = "-";
          }
          if (lastname == null) {
            lastname = "-";
          }
          if (nationality == null) {
            nationality = "-";
          }
          if (team_id == null) {
            team_id = "-";
          }
          if (weight == null) {
            weight = "-";
          }
          if (height == null) {
            height = "-";
          }
          if (team_id == null) {
            team_id = "-";
          }

          var position_id = player.position_id;
          var pos;
          if (position_id !== null) {
            var position = player['position'].data;
            if (position !== undefined || position['length'] !== 0 || position !== null) {
              pos = position.name;
            }
            else {
              pos = "-";
            }
          }
          else {
            pos = "-";
          }

          this.player_collection.push({
            "id": player_id,
            "age": age,
            "birthcountry": birthcountry,
            "birthdate": birthdate_formatte,
            "birthplace": birthplace,
            "name": fullname,
            "common_name": common_name,
            "firstname": firstname,
            "lastname": lastname,
            "nationality": nationality,
            "team": team_name,
            "teamid": team_id,
            "weight": weight,
            "height": height,
            "position": pos,
            "picture": player_image_path,
            "goals": goals
          });

          // <!--******** Domestic League ************-->

          //player stats---
          var stats: any = player["stats"];
          if (stats) {

            var stats_record: any = stats['data'];
            if (stats_record !== undefined || stats_record['length'] !== 0 || stats_record !== null) {

              for (let row of stats_record) {
                console.log("row", row);

                var status_yellowcards: any = row["yellowcards"];
                var status_redcards: any = row["redcards"];
                var status_goals: any = row["goals"];
                var status_appearences: any = row["appearences"];

                //Team---
                var StatsTeam: any = row["team"];
                var status_TeamName: any = "-";
                var status_TeamId: any;
                var status_Teamlogo_path: any;
                if (StatsTeam) {
                  var StatsTeam_record: any = StatsTeam['data'];
                  if (StatsTeam_record !== undefined || StatsTeam_record['length'] !== 0 || StatsTeam_record !== null) {
                    status_TeamName = StatsTeam_record.name;
                    status_TeamId = StatsTeam_record.id;
                    status_Teamlogo_path = StatsTeam_record.logo_path;
                  }
                }
                // end Team---

                //League---
                var StatsLeague: any = row["league"];
                var status_LeagueName: any = "";
                var status_LeagueId: any = "";
                if (StatsLeague) {
                  var StatsLeague_record: any = StatsLeague['data'];
                  if (StatsLeague_record !== undefined || StatsLeague_record['length'] !== 0 || StatsLeague_record !== null) {
                    status_LeagueName = StatsLeague_record.name;
                    status_LeagueId = StatsLeague_record.id;
                  }
                }
                // end League---

                //Season---
                var StatsSeason: any = row["season"];
                var status_SeasonName: any = "";
                var status_SeasonId: any = "";
                if (StatsSeason) {
                  var StatsSeason_record: any = StatsSeason['data'];
                  if (StatsSeason_record !== undefined || StatsSeason_record['length'] !== 0 || StatsSeason_record !== null) {
                    status_SeasonName = StatsSeason_record.name;
                    status_SeasonId = StatsSeason_record.id;

                    this.playerStats_collection.push({
                      "season_name": status_SeasonName,
                      "team_name": status_TeamName,
                      "team_id": status_TeamId,
                      "team_flag": status_Teamlogo_path,
                      "league_name": status_LeagueName,
                      "yellowcards": status_yellowcards,
                      "redcards": status_redcards,
                      "goals": status_goals,
                      "appearences": status_appearences
                    })
                  }
                }
                // end Season---
              }
            }
          }
          //-----end stats
          // <!--******* end Domestic League ***********-->

        }
        this.player_collection_length = this.player_collection.length;
        this.playerStats_collection_length = this.playerStats_collection.length;
        this.showloader = false;
      }
      else {
        this.player_collection_length = 0;
        this.playerStats_collection_length = 0;
        this.showloader = false;
      }


    });
    console.log("Player collection", this.player_collection);

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
