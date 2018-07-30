import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesDetailComponentComponent } from './matches-detail-component.component';

describe('MatchesDetailComponentComponent', () => {
  let component: MatchesDetailComponentComponent;
  let fixture: ComponentFixture<MatchesDetailComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesDetailComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
