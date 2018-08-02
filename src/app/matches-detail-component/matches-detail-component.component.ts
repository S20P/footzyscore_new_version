import { Component, OnInit, Pipe, PipeTransform, Directive, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';

import { MatchesApiService } from '../service/live_match/matches-api.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { DatePipe } from '@angular/common';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

import * as moment from 'moment-timezone';
import "moment-timezone";

@Component(
    {
        selector: 'app-matches-detail-component',
        templateUrl: './matches-detail-component.component.html',
        styleUrls: ['./matches-detail-component.component.css']
    }
)
export class MatchesDetailComponentComponent implements OnInit {


    public match_detailcollection = [];
    public events_collection = [];
    public localteam_player_lineup = [];
    public visitorteam_player_lineup = [];
    public localteam_player_subs = [];
    public visitorteam_player_subs = [];
    public Commentary_collection = [];
    public match_stats_collection = [];
    public id: any;
    public comp_id: any;
    public ic_event_penalty_scored: any;
    public ic_event_own_goal: any;
    public ic_event_goal: any;
    public statsA_min: any;
    public status: any;
    public live_matches: boolean;
    public showloader: boolean = false;
    private subscription: Subscription;
    private timer: Observable<any>;
    // public flage_baseUrl: any;
    // public player_baseUrl: any;
    public season: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private matchService: MatchService,
        public datepipe: DatePipe,
        private liveMatchesApiService: MatchesApiService,
        private jsCustomeFun: JsCustomeFunScriptService
    ) {
        // this.flage_baseUrl = "/assets/img/TeamFlage/";
        // this.player_baseUrl = "https://s3.amazonaws.com/starapps/footzy/players/";
        this.ic_event_penalty_scored = false;
        this.ic_event_own_goal = false;
        this.ic_event_goal = false;
        this.live_matches = false;
        this.route.paramMap.subscribe((params: ParamMap) => {
            let id = parseInt(params.get("id"));
            this.id = id;
            this.GetMatchDeatilByMatchId(this.id);
        });
    }

    ngOnInit() {

        this.match_detailcollection = [];
        this.events_collection = [];

        this.liveMatchesApiService.liveMatches().subscribe(data => {
            this.GetMatchesByCompetition_ById_live();
            this.GetCommentariesByMatchId_live();
        });

        this.statsA_min = '20';
        this.setTimer();
    }
    public setTimer() {
        this.showloader = true;
        this.timer = Observable.timer(2000);
        this.subscription = this.timer.subscribe(() => {
            this.showloader = false;
        });
    }



    GetMatchesByCompetition_ById_live() {
        // this.match_detailcollection =[];
        let current_matchId;

        this.liveMatchesApiService.liveMatches().subscribe(data => {

            console.log("Live-Matches-data", data);

            var result = data['data'];

            console.log("live data", data['data']['events']);

            console.log("Matches is Live", data);
            if (result.events !== undefined) {

                this.live_matches = true;
                var result_events = data['data'].events;
                console.log("date is ", result_events.formatted_date);

                current_matchId = result_events['id'];

                for (let i = 0; i < this.match_detailcollection['length']; i++) {
                    if (this.match_detailcollection[i].id == current_matchId) {

                        var status_offon;
                        status_offon = true;

                        var visitorteam_score;
                        var localteam_score;
                        if (result_events.visitorteam_score == '?') {
                            visitorteam_score = "";
                            status_offon = false;
                        } else {
                            visitorteam_score = result_events.visitorteam_score;
                            status_offon = true;
                        }

                        if (result_events.localteam_score == '?') {
                            localteam_score = "";
                            status_offon = false;
                        } else {
                            localteam_score = result_events.localteam_score;
                            status_offon = true;
                        }

                        this.match_detailcollection[i]['status'] = result_events.status;
                        this.match_detailcollection[i]['localteam_score'] = localteam_score;
                        this.match_detailcollection[i]['visitorteam_score'] = visitorteam_score;
                        this.match_detailcollection[i]['id'] = result_events.id;
                        this.match_detailcollection[i]['live_status'] = status_offon;

                        let events_data = result_events['events'];
                        for (var e = 0; e < events_data['length']; e++) {

                            let result_pipe_l = events_data[e].result.replace(']', '');
                            let result_pipe = result_pipe_l.replace('[', '');

                            let ic_event_penalty_scored = false;
                            let ic_event_own_goal = false;
                            let ic_event_goal = false;
                            var type = events_data[e].type;

                            if (type == "goal") {

                                let player = events_data[e].player;
                                if (player.includes("(pen.)")) {
                                    ic_event_penalty_scored = true;
                                }
                                else if (player.includes("(o.g.)")) {
                                    ic_event_own_goal = true;
                                }
                                else {
                                    ic_event_goal = true;
                                }

                            }

                            this.events_collection[e]['id'] = events_data[e].id;
                            this.events_collection[e]['type'] = events_data[e].type;
                            this.events_collection[e]['minute'] = events_data[e].minute;
                            this.events_collection[e]['extra_min'] = events_data[e].extra_min;
                            this.events_collection[e]['team'] = events_data[e].team;
                            this.events_collection[e]['assist'] = events_data[e].assist;
                            this.events_collection[e]['assist_id'] = events_data[e].assist_id;
                            this.events_collection[e]['player'] = events_data[e].player;
                            this.events_collection[e]['player_id'] = events_data[e].player_id;
                            this.events_collection[e]['result'] = events_data[e].result;
                            this.events_collection[e]['ic_event_penalty_scored'] = events_data[e].ic_event_penalty_scored;
                            this.events_collection[e]['ic_event_own_goal'] = events_data[e].ic_event_own_goal;
                            this.events_collection[e]['ic_event_goal'] = events_data[e].ic_event_goal;


                        }
                    }
                }
            }
        });
    }



    GetCommentariesByMatchId_live() {

        this.liveMatchesApiService.liveMatches().subscribe(data => {

            console.log("Live-Matches-data", data);

            var result = data['data'];

            console.log("Matches is Live comments", data);
            if (result.commentaries !== undefined) {

                var result_comments = data['data'].commentaries;

                if (this.id == result_comments['match_id']) {
                    this.localteam_player_lineup = [];
                    this.visitorteam_player_lineup = [];
                    this.localteam_player_subs = [];
                    this.visitorteam_player_subs = [];
                    this.match_stats_collection = [];
                    this.Commentary_collection = [];

                    let lineup = result_comments['lineup'];
                    let subs = result_comments['subs'];
                    let comments = result_comments['comments'];
                    //    localteam_lineup------------------------------------------------------------------------------------
                    let localteam_lineup = lineup['localteam'];

                    for (var lt = 0; lt < localteam_lineup['length']; lt++) {

                        // var localteamLinePlayer_url = this.player_baseUrl + localteam_lineup[lt].id + ".jpg";



                        this.localteam_player_lineup.push({
                            "id": localteam_lineup[lt].id,
                            "name": localteam_lineup[lt].name,
                            "number": localteam_lineup[lt].number,
                            "pos": localteam_lineup[lt].pos,
                            // "picture": localteamLinePlayer_url,
                        });
                    }
                    //   end localteam_lineup-----------------------------------------------------------------------------------


                    //    localteam_subs----------------------------------------------------------------------------------------

                    let localteam_subs = subs['localteam'];

                    for (var lts = 0; lts < localteam_subs['length']; lts++) {
                        //var localteamSubsPayer_url = this.player_baseUrl + localteam_subs[lts].id + ".jpg";
                        // "picture": localteamSubsPayer_url,


                        this.localteam_player_subs.push({
                            "id": localteam_subs[lts].id,
                            "name": localteam_subs[lts].name,
                            "number": localteam_subs[lts].number,
                            "pos": localteam_subs[lts].pos,



                        });
                    }
                    //  end  localteam_subs------------------------------------------------------------------------------------



                    //    visitorteam_lineup------------------------------------------------------------------------------------

                    let visitorteam_lineup = lineup['visitorteam'];

                    for (var vt = 0; vt < visitorteam_lineup['length']; vt++) {

                        //var visitorteamLinePlayer_url = this.player_baseUrl + visitorteam_lineup[vt].id + ".jpg";
                        //"picture": visitorteamLinePlayer_url,

                        this.visitorteam_player_lineup.push({

                            "id": visitorteam_lineup[vt].id,
                            "name": visitorteam_lineup[vt].name,
                            "number": visitorteam_lineup[vt].number,
                            "pos": visitorteam_lineup[vt].pos,

                        });
                    }
                    //  end visitorteam_lineup--------------------------------------------------------------------------------

                    //    visitorteam_subs------------------------------------------------------------------------------------

                    let visitorteam_subs = subs['visitorteam'];

                    for (var vts = 0; vts < visitorteam_subs['length']; vts++) {

                        // var visitorteamSubsPayer_url = this.player_baseUrl + visitorteam_subs[vts].id + ".jpg";
                        //"picture": visitorteamSubsPayer_url,


                        this.visitorteam_player_subs.push({
                            "id": visitorteam_subs[vts].id,
                            "name": visitorteam_subs[vts].name,
                            "number": visitorteam_subs[vts].number,
                            "pos": visitorteam_subs[vts].pos,
                        });
                    }
                    //  end visitorteam_subs------------------------------------------------------------------------------------




                    //  comments---------------------------------------------------------------------------------------

                    for (var c = 0; c < comments['length']; c++) {


                        let GoalType = false;
                        let isAssist = false;
                        let isSubstitution = false;
                        let downSubstitution = false;
                        let yellowcard = false;
                        let redcard = false;

                        let UpName = "";
                        let DownName = "";
                        let comment_icon = "";

                        let comment = comments[c].comment;
                        let important = comments[c].important;
                        let isgoal = comments[c].isgoal;
                        let minute = comments[c].minute

                        if (important == '1' && isgoal == '1') {

                            GoalType = true;
                            comment_icon = "assets/img/ic_goal.png";

                            let Substring1 = comment.split(".", 2);
                            let Substring2 = Substring1[1].split("-", 2);
                            UpName = Substring2[0];

                            //check 'Assist' is or not in given comment 
                            if (comment.includes("Assist")) {
                                isAssist = true;
                                let SubstringAssist = comment.split("Assist -", 2);
                                let assistName = SubstringAssist[1].split("with", 2);
                                DownName = assistName[0];
                            }
                        }
                        else {
                            //check 'Substitution' is or not in given comment
                            if (comment.includes("Substitution")) {

                                isSubstitution = true;
                                comment_icon = "assets/img/ic_sub_on_off_both2.png";


                                console.log("Substitution is found.");

                                let String1 = comment.split(".", 2);
                                let String2 = String1[1].split("for", 2);
                                let String3 = String2[1].split("-", 2);

                                UpName = String2[0];
                                DownName = String3[0];

                            }
                            if (comment.includes("yellow card")) {

                                yellowcard = true;
                                comment_icon = "assets/img/ic_yellow_card.png";

                                let String1_yc = comment.split("-", 2);

                                UpName = String1_yc[0];
                                DownName = "yellow card";

                            }
                            if (comment.includes("red card")) {

                                redcard = true;
                                comment_icon = "assets/img/ic_red_card.png";

                                let String1_rc = comment.split("-", 2);

                                UpName = String1_rc[0];
                                DownName = "red card";

                            }



                        }


                        this.Commentary_collection.push({
                            "GoalType": GoalType,
                            "isAssist": isAssist,
                            "isSubstitution": isSubstitution,
                            "downSubstitution": downSubstitution,
                            "yellowcard": yellowcard,
                            "redcard": redcard,
                            "upName": UpName,
                            "downName": DownName,
                            "comment": comment,
                            "minute": minute,
                            "icon": comment_icon
                        });




                    }

                    //  end comments------------------------------------------------------------------------------------


                    //    match_stats------------------------------------------------------------------------------------

                    let match_stats = result_comments['match_stats'];

                    let localteam_match_stats = match_stats['localteam'];
                    let visitorteam_match_stats = match_stats['visitorteam'];

                    //   lt for localteam && vt for visitorteam

                    for (var st = 0; st < localteam_match_stats['length']; st++) {
                        this.match_stats_collection.push({
                            "lt_corners": localteam_match_stats[st].corners,
                            "lt_fouls": localteam_match_stats[st].fouls,
                            "lt_offsides": localteam_match_stats[st].offsides,
                            "lt_possesiontime": localteam_match_stats[st].possesiontime,
                            "lt_redcards": localteam_match_stats[st].redcards,
                            "lt_saves": localteam_match_stats[st].saves,
                            "lt_shots_ongoal": localteam_match_stats[st].shots_ongoal,
                            "lt_shots_total": localteam_match_stats[st].shots_total,
                            "lt_yellowcards": localteam_match_stats[st].yellowcards,
                            "vt_corners": visitorteam_match_stats[st].corners,
                            "vt_fouls": visitorteam_match_stats[st].fouls,
                            "vt_offsides": visitorteam_match_stats[st].offsides,
                            "vt_possesiontime": visitorteam_match_stats[st].possesiontime,
                            "vt_redcards": visitorteam_match_stats[st].redcards,
                            "vt_saves": visitorteam_match_stats[st].saves,
                            "vt_shots_ongoal": visitorteam_match_stats[st].shots_ongoal,
                            "vt_shots_total": visitorteam_match_stats[st].shots_total,
                            "vt_yellowcards": visitorteam_match_stats[st].yellowcards
                        });

                    }
                    //  end  match_stats------------------------------------------------------------------------------------
                }

            }


        });


    }


    //NEW 

    GetMatchDeatilByMatchId(match_id) {
        this.match_detailcollection = [];
        this.events_collection = [];
        this.localteam_player_lineup = [];
        this.visitorteam_player_lineup = [];
        this.localteam_player_subs = [];
        this.visitorteam_player_subs = [];
        this.match_stats_collection = [];
        this.Commentary_collection = [];
        this.matchService.GetMatchDeatilByMatchId(match_id).subscribe(data => {
            console.log("GetMatchDeatilByMatchId", data);
            // var result = data['data'];

            var res: any = data['data'];

            for (let result of res) {

                var id: any = result['id'];
                this.comp_id = result['league_id'];
                var stage: any = result['stage'];
                var week: any = stage['data'].name;

                //LocalTeam Data---------------------------------------------------------
                var localteam_id: any = result['localteam_id'];
                var localTeam_details: any = result['localTeam'].data;
                var localteam_name: any = localTeam_details.name;
                var flag__loal: any = localTeam_details.logo_path;

                //visitorTeam Data--------------------------------------------------------
                var visitorteam_id: any = result['visitorteam_id'];
                var visitorTeam_details: any = result['visitorTeam'].data;
                var visitorteam_name: any = visitorTeam_details.name;
                var flag_visit: any = visitorTeam_details.logo_path;

                //time---------------------------------------------------------------------
                var time: any = result['time'];
                var starting_at: any = time.starting_at;
                var date_time: any = starting_at.date_time; //YYYY-MM-DD H:MM:SS
                let match_time: any = this.jsCustomeFun.ChangeTimeZone(date_time);
                var status: any = time.status;

                var live_status: boolean = false;

                if (status == "LIVE" || status == "PEN_LIVE" || status == "HT" || status == "BREAK") {
                    live_status = true;
                    status = status;
                }
                else if (status == "FT" || status == "AET" || status == "POSTP" || status == "FT_PEN") {
                    live_status = false;
                    status = status;
                }
                else if (status == "NS" || status == "") {
                    live_status = false;
                    status = moment(match_time).format('hh:mm a');
                }
                else {
                    live_status = false;
                    status = status;
                }

                //end time-------------------------------------------------------------------

                //scores--------------------------------------------------------------------
                var scores: any = result['scores'];
                var ht_score: any = scores.ht_score;
                var ft_score: any = scores.ft_score;
                var et_score: any = scores.et_score;
                var localteam_score: any = scores.localteam_score;
                var visitorteam_score: any = scores.visitorteam_score;

                var score_status_flage: boolean = true;
                if (localteam_score == '?' || localteam_score == "" || localteam_score == null || visitorteam_score == '?' || visitorteam_score == "" || visitorteam_score == null) {
                    live_status = false;
                    score_status_flage = false;
                } else {
                    score_status_flage = true;
                }
                var penalty_visitor: any = scores.visitorteam_pen_score;
                var penalty_local: any = scores.localteam_pen_score;
                //end scores---------------------------------------------------------------

                //venue--------------------------------------------------------------------
                var venue_id: any = result['venue_id'];
                var venue_data;
                var venue_name;
                var venue_city;

                if (venue_id !== null) {
                    venue_data = result['venue'].data;
                    venue_name = venue_data.name;
                    venue_city = venue_data.city;
                }
                //end venue-----------------------------------------------------------------

                //season--------------------------------------------------------------------
                var season_id: any = result['season_id'];
                var season_data;
                var season_name;


                if (season_id !== null) {
                    season_data = result['season'].data;
                    season_name = season_data.name;
                    this.season = season_name;
                }
                //end season----------------------------------------------------------------


                this.match_detailcollection
                    .push({
                        "id": id,
                        "comp_id": this.comp_id,
                        "et_score": et_score,
                        "formatted_date": match_time,
                        "ft_score": ft_score,
                        "ht_score": ht_score,
                        "localteam_id": localteam_id,
                        "localteam_name": localteam_name,
                        "localteam_score": localteam_score,
                        "localteam_image": flag__loal,
                        "penalty_local": penalty_local,
                        "penalty_visitor": penalty_visitor,
                        "status": status,
                        "time": match_time,
                        "visitorteam_id": visitorteam_id,
                        "visitorteam_name": visitorteam_name,
                        "visitorteam_score": visitorteam_score,
                        "visitorteam_image": flag_visit,
                        "venue_id": venue_id,
                        "venue": venue_name,
                        "venue_city": venue_city,
                        "season": season_name,
                        "week": week,
                        "live_status": live_status,
                        "score_status_flage": score_status_flage,

                    });

                console.log("NEW ARRAY ------", this.match_detailcollection);

                //  match_Events-------------------------------------------------------------

                var events_data: any = result['events'].data;

                if (events_data !== undefined) {
                    for (var e = 0; e < events_data['length']; e++) {
                        var team;
                        if (events_data[e].team_id == localteam_id) {
                            team = "localteam";
                        }
                        if (events_data[e].team_id == visitorteam_id) {
                            team = "visitorteam";
                        }

                        var event_result: any;
                        if (events_data[e].result !== null) {
                            event_result = events_data[e].result
                        }

                        let ic_event_penalty = false;
                        let ic_event_own_goal = false;
                        let ic_event_goal = false;
                        let ic_event_yellow_card = false;
                        let ic_event_substitution = false;
                        let ic_event_yellowred = false;
                        let ic_event_missed_penalty = false;
                        let ic_event_pen_shootout_goal = false;
                        let ic_event_pen_shootout_miss = false;
                        let ic_event_redcard = false;

                        var type: any = events_data[e].type;

                        if (type == "goal") {
                            ic_event_goal = true;
                        }
                        if (type == "penalty") {
                            ic_event_penalty = true;
                        }
                        if (type == "missed_penalty") {
                            ic_event_missed_penalty = true;
                        }
                        if (type == "own-goal") {
                            ic_event_own_goal = true;
                        }
                        if (type == "substitution") {
                            ic_event_substitution = true;
                        }
                        if (type == "yellowcard") {
                            ic_event_yellow_card = true;
                        }
                        if (type == "yellowred") {
                            ic_event_yellowred = true;
                        }
                        if (type == "redcard") {
                            ic_event_redcard = true;
                        }
                        if (type == "pen_shootout_goal") {
                            ic_event_pen_shootout_goal = true;
                        }
                        if (type == "pen_shootout_miss") {
                            ic_event_pen_shootout_miss = true;
                        }

                        this.events_collection
                            .push({
                                "id": events_data[e].id,
                                "type": events_data[e].type,
                                "minute": events_data[e].minute,
                                "extra_min": events_data[e].extra_min,
                                "team": team,
                                "assist": events_data[e].related_player_name,
                                "assist_id": events_data[e].related_player_id,
                                "player": events_data[e].player_name,
                                "player_id": events_data[e].player_id,
                                "result": event_result,
                                "ic_event_goal": ic_event_goal,
                                "ic_event_penalty": ic_event_penalty,
                                "ic_event_missed_penalty": ic_event_missed_penalty,
                                "ic_event_own_goal": ic_event_own_goal,
                                "ic_event_substitution": ic_event_substitution,
                                "ic_event_yellow_card": ic_event_yellow_card,
                                "ic_event_yellowred": ic_event_yellowred,
                                "ic_event_redcard": ic_event_redcard,
                                "ic_event_pen_shootout_goal": ic_event_pen_shootout_goal,
                                "ic_event_pen_shootout_miss": ic_event_pen_shootout_miss
                            });
                    }
                    this.events_collection.reverse();
                    // end match_Events---------------------------------------------------------

                    //match_stats---------------------------------------------------------------

                    let match_stats = result['stats'].data;
                    var match_stats_lt = [];
                    var match_stats_vt = [];
                    if (match_stats !== null || match_stats['length'] == 0) {
                        for (var st = 0; st < match_stats['length']; st++) {

                            if (match_stats[st].team_id == localteam_id) {
                                match_stats_lt.push({
                                    "lt_corners": match_stats[st].corners,
                                    "lt_fouls": match_stats[st].fouls,
                                    "lt_offsides": match_stats[st].offsides,
                                    "lt_possesiontime": match_stats[st].possessiontime,
                                    "lt_redcards": match_stats[st].redcards,
                                    "lt_saves": match_stats[st].saves,
                                    "lt_shots_ongoal": match_stats[st].shots.ongoal,
                                    "lt_shots_total": match_stats[st].shots.total,
                                    "lt_yellowcards": match_stats[st].yellowcards,
                                });
                            }
                            if (match_stats[st].team_id == visitorteam_id) {
                                match_stats_vt.push({
                                    "vt_corners": match_stats[st].corners,
                                    "vt_fouls": match_stats[st].fouls,
                                    "vt_offsides": match_stats[st].offsides,
                                    "vt_possesiontime": match_stats[st].possessiontime,
                                    "vt_redcards": match_stats[st].redcards,
                                    "vt_saves": match_stats[st].saves,
                                    "vt_shots_ongoal": match_stats[st].shots.ongoal,
                                    "vt_shots_total": match_stats[st].shots.total,
                                    "vt_yellowcards": match_stats[st].yellowcards
                                });
                            }
                        }

                        console.log("l-status", match_stats_vt);
                        console.log("v-status", match_stats_vt);

                        this.match_stats_collection.push(Object.assign(match_stats_lt[0], match_stats_vt[0]));
                        console.log("match_stats_collection", this.match_stats_collection);
                    }
                    //end match_stats----------------------------------------------------------

                    // lineup------------------------------------------------------------------
                    let lineup = result['lineup'].data;

                    for (var lp = 0; lp < lineup['length']; lp++) {
                        // localteam_lineup-------------------------------------------------------------
                        if (lineup[lp].team_id == localteam_id) {
                            this.localteam_player_lineup.push({
                                "id": lineup[lp].player_id,
                                "name": lineup[lp].player_name,
                                "number": lineup[lp].number,
                                "pos": lineup[lp].position,
                            });
                        }
                        //end localteam_lineup--------------------------------------------------------

                        //visitorteam_lineup-----------------------------------------------------------
                        if (lineup[lp].team_id == visitorteam_id) {
                            this.visitorteam_player_lineup.push({
                                "id": lineup[lp].player_id,
                                "name": lineup[lp].player_name,
                                "number": lineup[lp].number,
                                "pos": lineup[lp].position,
                            });
                        }
                        //end visitorteam_lineup---------------------------------------------------------
                    }

                    //Substitutes(bench)-------------------------------------------------------------

                    let Substitutes = result['bench'].data;

                    for (var lp = 0; lp < Substitutes['length']; lp++) {
                        // localteam_lineup------------------------------------------------------------------------------------
                        if (Substitutes[lp].team_id == localteam_id) {
                            this.localteam_player_subs.push({
                                "id": Substitutes[lp].player_id,
                                "name": Substitutes[lp].player_name,
                                "number": Substitutes[lp].number,
                                "pos": Substitutes[lp].position,
                            });
                        }
                        //end localteam_Substitutes--------------------------------------------

                        //visitorteam_Substitutes----------------------------------------------
                        if (Substitutes[lp].team_id == visitorteam_id) {
                            this.visitorteam_player_subs.push({
                                "id": Substitutes[lp].player_id,
                                "name": Substitutes[lp].player_name,
                                "number": Substitutes[lp].number,
                                "pos": Substitutes[lp].position,
                            });
                        }
                        //end visitorteam_Substitutes---------------------------------------------
                    }
                    //end Substitutes(bench)-----------------------------------------------------

                    //  comments-----------------------------------------------------------------


                    let commentaries_status = result['commentaries'];

                    if (commentaries_status == true) {
                        this.matchService.GetCommentariesByMatchId(id).subscribe(data => {
                            var comments_collection: any = data['data'];


                            for (let item of comments_collection) {
                                var comments_data = item.comments;
                                var comments = comments_data['data'];

                                for (var c = 0; c < comments['length']; c++) {
                                    let GoalType = false;
                                    let isAssist = false;
                                    let isSubstitution = false;
                                    let downSubstitution = false;
                                    let yellowcard = false;
                                    let redcard = false;

                                    let UpName = "";
                                    let DownName = "";
                                    let comment_icon = "";

                                    let comment = comments[c].comment;
                                    let important = comments[c].important;
                                    let goal = comments[c].goal;
                                    let minute = comments[c].minute

                                    if (important == 'false' && goal == 'false') {

                                        GoalType = true;
                                        comment_icon = "assets/img/ic_event_goal.png";

                                        let Substring1 = comment.split(".", 2);
                                        let Substring2 = Substring1[1].split("-", 2);
                                        UpName = Substring2[0];

                                        //check 'Assist' is or not in given comment 
                                        if (comment.includes("Assist")) {
                                            isAssist = true;
                                            let SubstringAssist = comment.split("Assist -", 2);
                                            let assistName = SubstringAssist[1].split("with", 2);
                                            DownName = assistName[0];
                                        }
                                    }
                                    else {
                                        //check 'Substitution' is or not in given comment
                                        if (comment.includes("Substitution")) {

                                            isSubstitution = true;
                                            comment_icon = "assets/img/ic_event_substitution.png";

                                            console.log("Substitution is found.");

                                            let String1 = comment.split(".", 2);
                                            let String2 = String1[1].split("for", 2);
                                            let String3 = String2[1].split("-", 2);

                                            UpName = String2[0];
                                            DownName = String3[0];

                                        }
                                        if (comment.includes("yellow card")) {

                                            yellowcard = true;
                                            comment_icon = "assets/img/ic_event_yellow_card.png";

                                            let String1_yc = comment.split("-", 2);

                                            UpName = String1_yc[0];
                                            DownName = "yellow card";

                                        }
                                        if (comment.includes("red card")) {

                                            redcard = true;
                                            comment_icon = "assets/img/ic_event_redcard.png";

                                            let String1_rc = comment.split("-", 2);

                                            UpName = String1_rc[0];
                                            DownName = "red card";
                                        }
                                    }

                                    this.Commentary_collection.push({
                                        "GoalType": GoalType,
                                        "isAssist": isAssist,
                                        "isSubstitution": isSubstitution,
                                        "downSubstitution": downSubstitution,
                                        "yellowcard": yellowcard,
                                        "redcard": redcard,
                                        "upName": UpName,
                                        "downName": DownName,
                                        "comment": comment,
                                        "minute": minute,
                                        "icon": comment_icon
                                    });
                                }
                            }



                        });
                    }

                    // end comments------------------------------------------------------------

                }
            }
        });
    }

    Playerdetails(player_id) {
        this.router.navigate(['/player', player_id, { "comp_id": this.comp_id, "season": this.season }]);
    }

    gotomatch() {
        let selectedId = this.id ? this.id : null;
        this.router.navigate(['../', { id: selectedId }], { relativeTo: this.route })
    }

    teamdetails(team_id, team_name) {
        this.router.navigate(['/team', team_id, { "team_name": team_name }]);
    }

}
