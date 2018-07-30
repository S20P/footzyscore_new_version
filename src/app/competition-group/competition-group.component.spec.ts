import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionGroupComponent } from './competition-group.component';

describe('CompetitionGroupComponent', () => {
  let component: CompetitionGroupComponent;
  let fixture: ComponentFixture<CompetitionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
