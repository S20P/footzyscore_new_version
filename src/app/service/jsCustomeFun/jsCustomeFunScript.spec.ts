import { TestBed, inject } from '@angular/core/testing';

import { JsCustomeFunScriptService } from './jsCustomeFunScript.service';

describe('JsCustomeFunScriptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsCustomeFunScriptService]
    });
  });

  it('should be created', inject([JsCustomeFunScriptService], (service: JsCustomeFunScriptService) => {
    expect(service).toBeTruthy();
  }));
});
