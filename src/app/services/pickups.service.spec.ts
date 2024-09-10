import { TestBed } from '@angular/core/testing';

import { PickupsService } from './pickups.service';

describe('PickupsService', () => {
  let service: PickupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
