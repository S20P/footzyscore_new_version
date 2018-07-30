import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchStadiumComponent } from './match-stadium.component';

describe('MatchStadiumComponent', () => {
  let component: MatchStadiumComponent;
  let fixture: ComponentFixture<MatchStadiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchStadiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchStadiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
