import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPreviousMatchesComponent } from './team-previous-matches.component';

describe('TeamPreviousMatchesComponent', () => {
  let component: TeamPreviousMatchesComponent;
  let fixture: ComponentFixture<TeamPreviousMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPreviousMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPreviousMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
