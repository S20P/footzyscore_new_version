import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

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
  public comp_id: any;
  public season: any;
  public player_baseUrl: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.player_baseUrl = "https://s3.amazonaws.com/starapps/footzy/players/";
  }

  ngOnInit() {
    this.setTimer();

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.player_id = id;
      this.comp_id = parseInt(params.get("comp_id"));
      this.season = params.get("season");
    });


    this.PlayerDetails();
  }

  PlayerDetails() {
    this.player_collection = [];
    let player_id = this.player_id;
    this.matchService.GetPlayerById(player_id, this.comp_id, this.season).subscribe(data => {
      console.log("Player_Details", data);

      var result = data['data'];
      this.player_status = data['success'];
      var goals = data['goal'];

      if (result !== undefined) {
        for (let player of result) {

          var TeamPlayer_url = this.player_baseUrl + player['id'] + ".jpg";


          this.player_collection.push({
            "id": player['id'],
            "age": player['age'],
            "birthcountry": player['birthcountry'],
            "birthdate": player['birthdate'],
            "birthplace": player['birthplace'],
            "name": player['name'],
            "common_name": player['common_name'],
            "firstname": player['firstname'],
            "lastname": player['lastname'],
            "nationality": player['nationality'],
            "team": player['team'],
            "teamid": player['teamid'],
            "weight": player['weight'],
            "height": player['height'],
            "position": player['position'],
            "picture": TeamPlayer_url,
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
