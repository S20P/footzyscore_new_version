import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchesDashboardComponent } from './matches-dashboard/matches-dashboard.component';
import { MatchesDetailComponentComponent } from './matches-detail-component/matches-detail-component.component';
import { MatchGroupComponent } from './match-group/match-group.component';
import { MatchStadiumComponent } from './match-stadium/match-stadium.component';
import { StadiumDetailComponent } from './stadium-detail/stadium-detail.component';
import { MatchTeamsComponent } from './match-teams/match-teams.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { CompetitionComponent } from './competition/competition.component';

import { CompetitionGroupComponent } from './competition-group/competition-group.component';
import { CompetitionTeamsComponent } from './competition-teams/competition-teams.component';
import { CompetitionPlayerComponent } from './competition-player/competition-player.component';
import { CompetitionMatchesComponent } from './competition-matches/competition-matches.component';
import { TeamSquadComponent } from './team-squad/team-squad.component';
import { TeamNextMatchesComponent } from './team-next-matches/team-next-matches.component';
import { TeamPreviousMatchesComponent } from './team-previous-matches/team-previous-matches.component';
import { CompetitionsListComponent } from './competitions-list/competitions-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'matches', pathMatch: 'full' },
  { path: 'matches', component: MatchesDashboardComponent },  //All Matches
  { path: 'matches/:id', component: MatchesDetailComponentComponent },//Matche details
  { path: 'group', component: MatchGroupComponent },  //All Group
  { path: 'stadium', component: MatchStadiumComponent },  //All Stadium
  { path: 'stadium/:id', component: StadiumDetailComponent },  //Stadium details
  { path: 'teams', component: MatchTeamsComponent },  //All Teams
  { path: 'team/:id', component: TeamDetailComponent },  //Team details
  { path: 'player/:id', component: PlayerDetailComponent },  //Team details
  { path: 'competition/:id', component: CompetitionComponent },  //Team details
  { path: 'competition', component: CompetitionsListComponent },  //Team details
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
export const routingComponents = [MatchesDashboardComponent,
  MatchesDetailComponentComponent,
  MatchGroupComponent,
  MatchStadiumComponent,
  StadiumDetailComponent,
  MatchTeamsComponent,
  TeamDetailComponent,
  PlayerDetailComponent,
  CompetitionComponent,
  CompetitionGroupComponent,
  CompetitionTeamsComponent,
  CompetitionPlayerComponent,
  CompetitionMatchesComponent,
  TeamSquadComponent,
  TeamNextMatchesComponent,
  TeamPreviousMatchesComponent,
  CompetitionsListComponent,
];
