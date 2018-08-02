import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchService {

  baseurl: string = "https://api.footzyscore.com/v2/";
  _baseurl_local: string = "https://api.footzyscore.com/v2/";
  Apiurl: string = this.baseurl + "MobileAPI/GetAllCompetitions";


  GetMatchesByCompetitionById_API: string = this.baseurl + "MobileAPI/GetMatchesByCompetitionId";


  getStadiumAll_API: string = "/assets/data/json/FifaMatchStadiums.json";

  GetPlayerById_API: string = this.baseurl + "MobileAPI/GetPlayerProfileById";
  GetAllKnockout_API: string = this.baseurl + "MobileAPI/GetAllKnockout";
  StaticMatch_API: string = "/assets/data/json/FifaMatchSchedule.json";

  //new
  GetAllCompetitionMatchesByMonth_API: string = this._baseurl_local + "MobileAPI/GetAllMatchesByMonth";
  GetAllCompetitionMatchesByDate_API: string = this._baseurl_local + "MobileAPI/GetMatchesByDate";
  GetMatchDeatilByMatchId_API: string = this._baseurl_local + "MobileAPI/GetMatchDeatilByMatchId";
  GetStandingBySeasonId_API: string = this._baseurl_local + "MobileAPI/GetStandingBySeasonId";
  GetAllTopTeamByLeagueId_API: string = this._baseurl_local + "MobileAPI/GetAllTopTeamByLeagueId";
  GetAllTopPlayerByLeagueId_API: string = this._baseurl_local + "MobileAPI/GetAllTopPlayerByLeagueId";

  GetSquadByTeamId_API: string = this._baseurl_local + "MobileAPI/GetSquadByTeamId";
  GetPreviousMatchesTeamById_API: string = this._baseurl_local + "MobileAPI/GetPreviousMatchesTeamById";
  GetNextMatchesTeamById_API: string = this._baseurl_local + "MobileAPI/GetNextMatchesTeamById";
  GetAllLeague_API: string = this._baseurl_local + "MobileAPI/GetAllLeague";
  GetAllMatchesBySeasonId_API: string = this._baseurl_local + "MobileAPI/GetAllMatchesBySeasonId";
  GetCommentariesByMatchId_API: string = this._baseurl_local + "MobileAPI/GetCommentariesByMatchId";
  GetSeasonByLeagueId_API: string = this._baseurl_local + "MobileAPI/GetSeasonByLeagueId";

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

  GetPlayerById(player_id, comp_id, season) {
    let apiurl = `${this.GetPlayerById_API + '?player_id=' + player_id + '&season=' + season + '&comp_id=' + comp_id}`;
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

    //Ex----
    // var fromdate = "2018-07-01";
    // var todate = "2018-07-31";
    // var timezone = "Asia/Kolkata";

    let apiurl = `${this.GetAllCompetitionMatchesByDate_API + '?date=' + date + '&timezone=' + timezone}`;
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



  GetAllMatchesBySeasonId(season_id) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetAllMatchesBySeasonId_API + '?season_id=' + season_id}`;
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
  GetSquadByTeamId(team_id) {
    let apiurl = `${this.GetSquadByTeamId_API + '?team_id=' + team_id}`;
    return this.http.get(apiurl);
  }
  GetPreviousMatchesTeamById(team_id) {
    let apiurl = `${this.GetPreviousMatchesTeamById_API + '?team_id=' + team_id}`;
    return this.http.get(apiurl);
  }
  GetNextMatchesTeamById(team_id) {
    let apiurl = `${this.GetNextMatchesTeamById_API + '?team_id=' + team_id + '&pageNo=1&size=1000'}`;
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


}
