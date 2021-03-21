import { TestBed } from '@angular/core/testing';

import { NomineeService } from '../nominee.service';

describe('NomineeService', () => {
  let service: NomineeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NomineeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
