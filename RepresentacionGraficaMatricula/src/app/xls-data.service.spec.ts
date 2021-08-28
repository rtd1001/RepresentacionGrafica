import { TestBed } from '@angular/core/testing';

import { XlsDataService } from './xls-data.service';

describe('XlsDataService', () => {
  let service: XlsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XlsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
