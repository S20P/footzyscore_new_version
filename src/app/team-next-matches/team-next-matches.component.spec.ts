import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNextMatchesComponent } from './team-next-matches.component';

describe('TeamNextMatchesComponent', () => {
  let component: TeamNextMatchesComponent;
  let fixture: ComponentFixture<TeamNextMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamNextMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNextMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
