import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
declare var $: any;
declare var jQuery: any;
import * as moment from 'moment-timezone';
import "moment-timezone";
@Injectable()
export class MatchService {

  baseurl: string = "https://api.footzyscore.com/v2/";
  _baseurl_local: string = "https://api.footzyscore.com/v2/";
  Apiurl: string = this.baseurl + "MobileAPI/GetAllCompetitions";


  GetMatchesByCompetitionById_API: string = this.baseurl + "MobileAPI/GetMatchesByCompetitionId";


  getStadiumAll_API: string = "/assets/data/json/FifaMatchStadiums.json";

  GetPlayerById_API: string = this.baseurl + "MobileAPI/GetPlayerDeatilsById";
  GetAllKnockout_API: string = this.baseurl + "MobileAPI/GetAllKnockout";
  StaticMatch_API: string = "/assets/data/json/FifaMatchSchedule.json";

  //new
  GetAllCompetitionMatchesByMonth_API: string = this._baseurl_local + "MobileAPI/GetAllMatchDatesByMonth";
  GetAllCompetitionMatchesByDate_API: string = this._baseurl_local + "MobileAPI/GetMatchesByDate";
  GetMatchDeatilByMatchId_API: string = this._baseurl_local + "MobileAPI/GetMatchDeatilByMatchId";
  GetStandingBySeasonId_API: string = this._baseurl_local + "MobileAPI/GetStandingBySeasonId";
  GetAllTopTeamByLeagueId_API: string = this._baseurl_local + "MobileAPI/GetAllTopTeamByLeagueId";
  GetAllTopPlayerByLeagueId_API: string = this._baseurl_local + "MobileAPI/GetAllTopPlayerByLeagueId";

  GetTeamDeatilsById_API: string = this._baseurl_local + "MobileAPI/GetTeamDeatilsById";
  GetPreviousMatchesTeamById_API: string = this._baseurl_local + "MobileAPI/GetPreviousMatchesTeamById";
  GetNextMatchesTeamById_API: string = this._baseurl_local + "MobileAPI/GetNextMatchesTeamById";
  GetAllLeague_API: string = this._baseurl_local + "MobileAPI/GetAllLeague";
  GetAllGroupsBySeasonId_API: string = this._baseurl_local + "MobileAPI/GetAllGroupsBySeasonId";
  GetCommentariesByMatchId_API: string = this._baseurl_local + "MobileAPI/GetCommentariesByMatchId";
  GetSeasonByLeagueId_API: string = this._baseurl_local + "MobileAPI/GetSeasonByLeagueId";
  GetAllLiveMatchesByDate_API: string = this._baseurl_local + "MobileAPI/GetAllLiveMatchesByDate";
  GetAllMatchesByRoundId_API: string = this._baseurl_local + "MobileAPI/GetAllMatchesByRoundId";
  GetAllMatchesByStageId_API: string = this._baseurl_local + "MobileAPI/GetAllMatchesByStageId";


  constructor(private http: HttpClient) {
  }

  GetAllCompetitions() {
    let url = `${this.Apiurl}`;
    return this.http.get(url);
  }


  GetMatchesByCompetition_ById(comp_id) {
    //console.log("comp_id is",comp_id);
    let apiurl = `${this.GetMatchesByCompetitionById_API + '?comp_id=' + comp_id}`;
    return this.http.get(apiurl);
  }

  GetCommentariesByMatchId(match_id) {
    let apiurl = `${this.GetCommentariesByMatchId_API + '?match_id=' + match_id}`;
    return this.http.get(apiurl);
  }


  getStadiumAllFromJson() {
    let apiurl = `${this.getStadiumAll_API}`;
    return this.http.get(apiurl);
  }

  GetPlayerDeatilsById(player_id) {
    let apiurl = `${this.GetPlayerById_API + '?player_id=' + player_id}`;
    return this.http.get(apiurl);
  }


  GetStaticMatches() {
    let apiurl = `${this.StaticMatch_API}`;
    return this.http.get(apiurl);
  }

  GetAllKnockout() {
    let apiurl = `${this.GetAllKnockout_API}`;
    return this.http.get(apiurl);
  }



  //new 
  GetAllCompetitionMatchesByMonth(param) {

    //Parameter: fromdate , todate: required* date format must be YYYY-MM-DD timezone : your localtimezone
    //Ex----
    // var fromdate = "2018-07-01";
    // var todate = "2018-07-31";
    // var timezone = "Asia/Kolkata";


    console.log("**param**", param);

    var fromdate = param.firstDay;
    var todate = param.lastDay;
    var timezone = param.localtimezone;

    let apiurl = `${this.GetAllCompetitionMatchesByMonth_API + '?fromdate=' + fromdate + '&todate=' + todate + '&timezone=' + timezone}`;
    return this.http.get(apiurl);

  }




  GetAllCompetitionMatchesByDate(param) {

    // ?date=2018-07-07&timezone=Asia/Kolkata
    console.log("**param**", param);




    var date = param.date;
    var timezone = param.localtimezone;

    var todays = moment(new Date()).format('YYYY-MM-DD');

    var date1 = moment(new Date(todays + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
    var date2 = moment(new Date(date + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');

    console.log("date1", date1);
    console.log("date2", date2);

    var d1 = moment(date1).valueOf();
    var d2 = moment(date2).valueOf();

    var url_path: any;

    if (d1 == d2) {
      console.log("current date is todays date", date);
      url_path = this.GetAllLiveMatchesByDate_API;
    } else {
      console.log("current date is not todays date", date);
      url_path = this.GetAllCompetitionMatchesByDate_API;
    }

    //Ex----
    // var fromdate = "2018-07-01";
    // var todate = "2018-07-31";
    // var timezone = "Asia/Kolkata";

    let apiurl = `${url_path + '?date=' + date + '&timezone=' + timezone}`;
    return this.http.get(apiurl);
  }

  GetMatchDeatilByMatchId(match_id) {
    let apiurl = `${this.GetMatchDeatilByMatchId_API + '?match_id=' + match_id}`;
    return this.http.get(apiurl);
  }

  GetStandingBySeasonId(season_id) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetStandingBySeasonId_API + '?season_id=' + season_id}`;
    return this.http.get(apiurl);
  }



  //Teams------------

  GetAllTopTeamByLeagueId(league_id, season_id) {
    let apiurl = `${this.GetAllTopTeamByLeagueId_API + '?league_id=' + league_id + '&season_id=' + season_id}`;
    return this.http.get(apiurl);
  }
  GetAllTopPlayerByLeagueId(league_id, season_id) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetAllTopPlayerByLeagueId_API + '?league_id=' + league_id + '&season_id=' + season_id}`;
    return this.http.get(apiurl);
  }
  GetTeamDeatilsById(team_id) {
    let apiurl = `${this.GetTeamDeatilsById_API + '?team_id=' + team_id}`;
    return this.http.get(apiurl);
  }
  GetPreviousMatchesTeamById(team_id) {
    let apiurl = `${this.GetPreviousMatchesTeamById_API + '?team_id=' + team_id}`;
    return this.http.get(apiurl);
  }
  GetNextMatchesTeamById(team_id, pageNo) {
    let apiurl = `${this.GetNextMatchesTeamById_API + '?team_id=' + team_id + '&pageNo=' + pageNo + '&size=10'}`;
    return this.http.get(apiurl);
  }

  GetAllLeague() {
    let apiurl = `${this.GetAllLeague_API}`;
    return this.http.get(apiurl);
  }

  GetSeasonByLeagueId(league_id) {
    let apiurl = `${this.GetSeasonByLeagueId_API + '?league_id=' + league_id}`;
    return this.http.get(apiurl);
  }


  //competion-matches-com----API
  GetAllGroupsBySeasonId(season_id) {
    let apiurl = `${this.GetAllGroupsBySeasonId_API + '?season_id=' + season_id}`;
    return this.http.get(apiurl);
  }
  // GetAllMatchesByRoundId(season_id, round_id) {
  //   let apiurl = `${this.GetAllMatchesByRoundId_API + '?season_id=' + season_id + '?round_id=' + round_id}`;
  //   return this.http.get(apiurl);
  // }
  // GetAllMatchesByStageId(season_id, stage_id) {
  //   let apiurl = `${this.GetAllMatchesByStageId_API + '?season_id=' + season_id + '?stage_id=' + stage_id}`;
  //   return this.http.get(apiurl);
  // }


  GetAllMatchesByWeek(paramobject) {

    var season_id = paramobject.season_id;
    var islistType = paramobject.islistType;
    var id = paramobject.id;
    var round_id;
    var stage_id;
    var query_str;
    var query_url;
    if (islistType == "round") {
      console.log("call GetAllMatchesByRoundId API");
      query_str = '&round_id=' + id;
      query_url = this.GetAllMatchesByRoundId_API;
    }
    if (islistType == "stage") {
      console.log("call GetAllMatchesByStageId API");
      query_str = '&stage_id=' + id;
      query_url = this.GetAllMatchesByStageId_API;
    }
    let apiurl = `${query_url + '?season_id=' + season_id + query_str}`;
    console.log("full query string url is", apiurl);
    return this.http.get(apiurl);
  }
}
