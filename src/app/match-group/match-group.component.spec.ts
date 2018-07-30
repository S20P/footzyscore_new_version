import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchGroupComponent } from './match-group.component';

describe('MatchGroupComponent', () => {
  let component: MatchGroupComponent;
  let fixture: ComponentFixture<MatchGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
