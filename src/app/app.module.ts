import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import { AppRoutingModule, routingComponents } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

// Pipe load----
import { OrderModule } from 'ngx-order-pipe';
import { DatePipe } from '@angular/common';
import { GroupByPipe } from './short-array.pipe';
import { GroupByArrayPipe } from './group-by.pipe';

// Services load----
import { MatchesApiService } from './service/live_match/matches-api.service';
import { MatchService } from './service/match.service';
import { MessagingService } from './service/firebase/messaging.service';
import { JsCustomeFunScriptService } from './service/jsCustomeFun/jsCustomeFunScript.service';
import { PushNotificationService } from './service/push-notification/push-notification.service';

// Component load----
import { AppComponent } from './app.component';
import { CompetitionAsideRightComponent } from './competition-aside-right/competition-aside-right.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    GroupByPipe,
    GroupByArrayPipe,
    SidebarComponent,
    CompetitionAsideRightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    OrderModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // for database
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgxPageScrollModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [MatchesApiService, MatchService, DatePipe, PushNotificationService, MessagingService, JsCustomeFunScriptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
