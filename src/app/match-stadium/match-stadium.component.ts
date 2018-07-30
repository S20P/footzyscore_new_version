import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-match-stadium',
  templateUrl: './match-stadium.component.html',
  styleUrls: ['./match-stadium.component.css']
})
export class MatchStadiumComponent implements OnInit {


  public showloader: boolean = false;      
  private subscription: Subscription;
  private timer: Observable<any>;

  public name;
  stadiumall_collecction = [];



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
  ) { }

  ngOnInit() {
    this.setTimer();
    this.getStadiumAll();
  }


   public getStadiumAll(){
        console.log("get Stadium record from json");
        this.stadiumall_collecction = [];
        this.matchService.getStadiumAllFromJson().subscribe(data => {
          console.log("Stadium Record for json ", data['Places']);
          var result = data['Places'];
          if (result !== undefined) {
          for(let place of result){
            this.stadiumall_collecction.push(place); 
          }
        }
         });
       console.log("Stadium_Places",this.stadiumall_collecction.length);
       console.log("");
   }

  public setTimer(){
    this.showloader   = true;
    $('#dd').refresh;
    this.timer        = Observable.timer(2000); 
    this.subscription = this.timer.subscribe(() => {
    this.showloader = false;
    });
  }


  //Go to Stadium Details Page, using Stadium ID
  StadiumDetails(stadium_id){
   console.log("view Stadium Details for this Id",stadium_id);
    this.router.navigate([stadium_id], { relativeTo: this.route });
  }


}