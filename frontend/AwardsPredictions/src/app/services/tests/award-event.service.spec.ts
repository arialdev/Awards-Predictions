import { TestBed } from '@angular/core/testing';

import { AwardEventService } from '../award-event.service';

describe('AwardEventService', () => {
  let service: AwardEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwardEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
