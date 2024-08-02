import { TestBed } from '@angular/core/testing';

import { TourOrganizerService } from './tour-organizer.service';

describe('TourOrganizerService', () => {
  let service: TourOrganizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourOrganizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
