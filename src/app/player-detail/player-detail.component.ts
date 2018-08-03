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
  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public player_id: any;
  public player_status: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {

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
    this.player_collection = [];
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
        }
      }
    });
    console.log("Player collection", this.player_collection)

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
