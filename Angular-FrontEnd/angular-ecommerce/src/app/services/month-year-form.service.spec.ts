import { TestBed } from '@angular/core/testing';

import { MonthYearFormService } from './month-year-form.service';

describe('MonthYearFormService', () => {
  let service: MonthYearFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthYearFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
