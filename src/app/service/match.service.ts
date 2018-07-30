import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchService {

  baseurl: string = "https://api.footzyscore.com/";

  _baseurl_local: string = "https://api.footzyscore.com/";

  Apiurl: string = this.baseurl + "MobileAPI/GetAllCompetitions";

  //GetCompetitionStandingById_API: string = this.baseurl + "MobileAPI/GetCompetitionStandingById";
  GetMatchesByCompetitionById_API: string = this.baseurl + "MobileAPI/GetMatchesByCompetitionId";
  GetMatchesByDate_API: string = this.baseurl + "MobileAPI/GetMatchesByDate";
  GetCommentariesByMatchId_API: string = this.baseurl + "MobileAPI/GetCommentariesByMatchId";
  getStadiumAll_API: string = "/assets/data/json/FifaMatchStadiums.json";
 
  GetPlayerById_API: string = this.baseurl + "MobileAPI/GetPlayerProfileById";
  GetAllKnockout_API: string = this.baseurl + "MobileAPI/GetAllKnockout";
  StaticMatch_API: string = "/assets/data/json/FifaMatchSchedule.json";

  //new
  GetAllCompetitionMatchesByMonth_API: string = this._baseurl_local + "MobileAPI/GetAllCompetitionMatchesByMonth";
  GetAllCompetitionMatchesByDate_API: string = this._baseurl_local + "MobileAPI/GetAllCompetitionMatchesByDate";
  GetMatchDeatilByMatchId_API: string = this._baseurl_local + "MobileAPI/GetMatchDeatilByMatchId";
  GetCompetitionStandingById_API: string = this._baseurl_local + "MobileAPI/GetCompetitionStandingById";
  GetAllTopTeamByCompId_API: string = this._baseurl_local + "MobileAPI/GetAllTopTeamByCompId";
  GetAllTopPlayerByCompId_API: string = this._baseurl_local + "MobileAPI/GetAllTopPlayerByCompId";
  // GetAllMatchesByWeek_API: string = this._baseurl_local + "MobileAPI/GetAllMatchesByWeek";
  GetSquadByTeamId_API: string = this._baseurl_local + "MobileAPI/GetSquadByTeamId";
  GetPreviousMatchesTeamById_API: string = this._baseurl_local + "MobileAPI/GetPreviousMatchesTeamById";
  GetNextMatchesTeamById_API: string = this._baseurl_local + "MobileAPI/GetNextMatchesTeamById";
  GetAllLeague_API : string = this._baseurl_local + "MobileAPI/GetAllLeague";
  GetAllMatchesByWeek_API: string = this._baseurl_local + "MobileAPI/GetAllMatchesByCompId";

  



  constructor(private http: HttpClient) {
  }

  GetAllCompetitions() {
    let url = `${this.Apiurl}`;
    return this.http.get(url);
  }

  // GetAllCompetitions_ById(comp_id) {
  //   // console.log("comp_id is",comp_id);
  //   let apiurl = `${this.GetCompetitionStandingById_API + '?comp_id=' + comp_id}`;
  //   return this.http.get(apiurl);
  // }

  GetMatchesByCompetition_ById(comp_id) {
    //console.log("comp_id is",comp_id);
    let apiurl = `${this.GetMatchesByCompetitionById_API + '?comp_id=' + comp_id}`;
    return this.http.get(apiurl);
  }


  GetMatchesByDate(date) {
    let apiurl = `${this.GetMatchesByDate_API + '?date=' + date}`;
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

  GetPlayerById(player_id,comp_id, season) {
    let apiurl = `${this.GetPlayerById_API + '?player_id=' + player_id+'&season=' + season + '&comp_id=' + comp_id}`;
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

  GetAllCompetitions_ById(comp_id, season) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetCompetitionStandingById_API + '?season=' + season + '&comp_id=' + comp_id}`;
    return this.http.get(apiurl);
  }

 
  GetAllTopPlayerByCompId(comp_id, season) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetAllTopPlayerByCompId_API + '?season=' + season + '&comp_id=' + comp_id}`;
    return this.http.get(apiurl);
  }
  GetAllMatchesByWeek(comp_id, season) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetAllMatchesByWeek_API + '?season=' + season + '&comp_id=' + comp_id}`;
    return this.http.get(apiurl);
  }

  //Teams------------

  GetAllTopTeamByCompId(comp_id, season) {
    // console.log("comp_id is",comp_id);
    let apiurl = `${this.GetAllTopTeamByCompId_API + '?season=' + season + '&comp_id=' + comp_id}`;
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
    let apiurl = `${this.GetNextMatchesTeamById_API + '?team_id=' + team_id +'&pageNo=1&size=1000'}`;
    return this.http.get(apiurl);
  }

  GetAllLeague(){
    let apiurl = `${this.GetAllLeague_API}`;
    return this.http.get(apiurl);
  }


}
