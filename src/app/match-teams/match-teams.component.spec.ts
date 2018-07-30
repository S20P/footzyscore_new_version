import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTeamsComponent } from './match-teams.component';

describe('MatchTeamsComponent', () => {
  let component: MatchTeamsComponent;
  let fixture: ComponentFixture<MatchTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
