import { TestBed, inject } from '@angular/core/testing';

import { MatchesApiService } from './matches-api.service';

describe('MatchesApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchesApiService]
    });
  });

  it('should be created', inject([MatchesApiService], (service: MatchesApiService) => {
    expect(service).toBeTruthy();
  }));
});
