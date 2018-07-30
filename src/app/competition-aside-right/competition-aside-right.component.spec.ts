import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionAsideRightComponent } from './competition-aside-right.component';

describe('CompetitionAsideRightComponent', () => {
  let component: CompetitionAsideRightComponent;
  let fixture: ComponentFixture<CompetitionAsideRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionAsideRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionAsideRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
